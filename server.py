import uvicorn 
from fastapi import FastAPI
from gensim.models import Word2Vec, KeyedVectors
from scipy.spatial.distance import cosine
import numpy as np

# Load pre-trained Word2Vec model (e.g., Google News vectors)
# Ensure you have downloaded Google News vectors or another pretrained model
model_path = 'path/to/GoogleNews-vectors-negative300.bin'
model = KeyedVectors.load_word2vec_format(model_path, binary=True)

app = FastAPI()

# sample data for now; later read from mongo or something.
data = {
    "eshaan": {
        "interests": [
            "Programming",
            "Swimming",
            "Water",
            "Reinforcement Learning",
            "Yay"
        ],
        "deviceId": ""
    },
    "sophia liang": {
        "interests": [
            "Data Science",
            "Cycling",
            "Machine Learning",
            "Artificial Intelligence",
            "Gardening"
        ],
        "deviceId": ""
    },
    "liam carter": {
        "interests": [
            "Web Development",
            "Hiking",
            "Gaming",
            "Machine Learning",
            "Digital Art"
        ],
        "deviceId": ""
    },
    "olivia ray": {
        "interests": [
            "Cybersecurity",
            "Swimming",
            "Photography",
            "Blockchain",
            "Space"
        ],
        "deviceId": ""
    },
    "noah patel": {
        "interests": [
            "Cloud Computing",
            "Soccer",
            "AI Ethics",
            "Cryptography",
            "Cooking"
        ],
        "deviceId": ""
    },
    "mia johnson": {
        "interests": [
            "Biotechnology",
            "Running",
            "Data Visualization",
            "Programming",
            "Science Fiction"
        ],
        "deviceId": ""
    }
}


def average_vector(interests):
    vectors = [model[word] for word in interests if word in model]
    if not vectors:  # In case no words are found in the model
        return np.zeros(model.vector_size)
    return np.mean(vectors, axis=0)

# interests are lists 
def calculate_score (person1_interests, person2_interests):
    # Calculate average vectors for both people
    person1_vector = average_vector(person1_interests)
    person2_vector = average_vector(person2_interests)

    # Calculate cosine similarity
    similarity_score = 1 - cosine(person1_vector, person2_vector)

@app.get("/")
def read_root():
    return "Name tag two"

@app.get("/test-name")
def read_root():
    return "Name tag one"


@app.get("/get_status")
def get_status (deviceId:str):
    d = None
    name = ""
    for v in data:
        if v["deviceId"] == deviceId:
            d = data[v]

    return {
        "first_name": name,
        "second_name": d[""]
    }

@app.get("/set_device_id")
def set_device_id (name: str, device_id: str):
    data[name]["deviceId"] = device_id

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8765,
        log_level="debug",
        reload=True,
    )