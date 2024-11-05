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

cred = None
ref = None
wv = None

@asynccontextmanager
async def init (app: FastAPI): 
    global cred, ref, wv
    
    # print("Downloading google news")
    # wv = api.load('word2vec-google-news-300')
    # vec_king = wv['king']
    # print(vec_king)

    print("Connecting to firebase...")
    cred = credentials.Certificate('edd-project-f9d25-firebase-adminsdk-5j8or-af0ed4174f.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': "https://edd-project-f9d25-default-rtdb.firebaseio.com",
    })
    ref = db.reference("participants")
    print("done")
    yield

# =====================================================================
# ==                             App                                 ==
# =====================================================================
app = FastAPI(lifespan=init)

@app.get("/status")
def status (device_id:str): 
    data = ref.get()
    n = None
    if data != None:
        for i in data:
            d = data[i]
            if d['deviceId'] == device_id:
                n = d["name"]
    
    if n == None:
        return ""
    else:
        return n + ",Ignore this"


"""
netsh interface portproxy add v4tov4 listenport=8765 listenaddress=0.0.0.0 connectport=8765 connectaddress=172.19.62.87
Need to run this: https://learn.microsoft.com/en-us/windows/wsl/networking
"""

if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8765,
        log_level="debug",
        reload=True,
    )