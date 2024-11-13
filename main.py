from pprint import pprint
from json import load
import uvicorn 
from fastapi import FastAPI
from scipy.spatial.distance import cosine
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from contextlib import asynccontextmanager
import gensim.downloader as api
import requests

# =====================================================================
# ==                       Similarity Score                          ==
# =====================================================================
# model_path = './GoogleNews-vectors-negative300.bin'
# model = KeyedVectors.load_word2vec_format(model_path, binary=True)

# def average_vector(interests):
#     vectors = [model[word] for word in interests if word in model]
#     if not vectors:  # In case no words are found in the model
#         return np.zeros(model.vector_size)
#     return np.mean(vectors, axis=0)

# # interests are lists 
# def calculate_score (person1_interests, person2_interests):
#     # Calculate average vectors for both people
#     person1_vector = average_vector(person1_interests)
#     person2_vector = average_vector(person2_interests)

#     # Calculate cosine similarity
#     return 1 - cosine(person1_vector, person2_vector)

# =====================================================================
# ==                     Connect to Firebase                         ==
# =====================================================================


def get_embeddings (interests):
    # free embeddings??

    url = 'https://api.jina.ai/v1/embeddings'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer jina_7818739f02b4474b95ef60de3f5a7ecb5E9xjJj2xAFNzcbr22g8WtFQ7_H7'
    }
    data = {
        "model": "jina-embeddings-v3",
        "task": "text-matching",
        "dimensions": 1024,
        "late_chunking": True,
        "embedding_type": "float",
        "input": interests
    }
    response = requests.post(url, json=data, headers=headers).json()
    d = response['data']
    
    ems = np.zeros((1, 1024))
    for i in range(len(d)):
        t = interests[d[i]["index"]]
        ems += np.array(d[i]["embedding"])

    ems /= 5 # average
    
    return ems.tolist()

cred = None
wv = None
ref_devices = None

@asynccontextmanager
async def init (app: FastAPI): 
    global cred, wv, ref_devices
    
    print("Connecting to firebase...")
    cred = credentials.Certificate('edd-project-f9d25-firebase-adminsdk-5j8or-af0ed4174f.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': "https://edd-project-f9d25-default-rtdb.firebaseio.com",
    })
    ref_devices = db.reference("devices")
    print("done")
    yield

# =====================================================================
# ==                             App                                 ==
# =====================================================================

"""
{'-OAhgWN9Kg31zs7895yw': {'deviceId': 'be231c',
                          'interests': ['ghghg',
                                        'hfgfgf',
                                        'fgfgf',
                                        'fgfgf',
                                        'hgghgh'],
                          'name': 'yung there',
                          'timestamp': 1730564721661}}
"""

app = FastAPI(lifespan=init)

@app.get("/status")
def status (device_id:str): 
    data = ref_devices.get()
    if device_id in data: 
        n = data[device_id]["name"]
        d = data[device_id]["display"] 
        if len(n) > 0 and len(d) > 0:
            return data[device_id]["name"] + "," + data[device_id]["display"] 
        else:
            return ""
    else:
        return ""

@app.get("/setUserVector")
def setUserVector (
    userId: str ,
    interestOne: str,
    interestTwo: str,
    interestThree: str,
    interestFour: str,
    interestFive: str,
):
    ems = get_embeddings([
        interestOne,
        interestTwo,
        interestThree,
        interestFour,
        interestFive
    ]) 
    data = ref_users.get()
    data[userId]["embedding"] = ems
    ref_users.set(data)

"""
netsh interface portproxy add v4tov4 listenport=8765 listenaddress=0.0.0.0 connectport=8765 connectaddress=172.19.62.87
Need to run this command because of https://learn.microsoft.com/en-us/windows/wsl/networking
WSL2 for some reason needs port forwarding to listen to all devices on LAN
Note that connectaddress is the wsl address: run wsl hostname -I
Need to run on powershell admin, but you can't use the result on `wsl hostname -I` on admin, because the address is different on admin account for some reason.
The client then sends the command to 172.20.10.3, which is the LAN hostname for the computer. You could check this on ipconfig under: "Wireless LAN adapter WiFi"
"""

if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8765,
        log_level="debug",
        reload=True,
    )