from time import sleep
import pickle
import csv
import requests
import numpy as np
from tqdm import tqdm

# get the embeddings

def get_embeddings(interests):
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

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()  
        d = response.json().get("data", [])
        ems = np.zeros(1024)
        for item in d:
            ems += np.array(item.get("embedding", np.zeros(1024)))

        # Average the embeddings (divide each element by 5 as in original code)
        ems /= 5

        return ems.tolist()  # Convert to a list before returning if needed

    except requests.RequestException as error:
        print("Error fetching embeddings:", error)
        return None

# embedding dict
embedding_dict = {}

with open("./people.csv", 'r') as file:
    dictReader = csv.DictReader(file)
    for row in tqdm(dictReader, total=43):
        interests = [
            row["Interest 1"].strip().lower(),
            row["Interest 2"].strip().lower(),
            row["Interest 3"].strip().lower(),
            row["Interest 4"].strip().lower(),
            row["Interest 5"].strip().lower(),
        ]
        
        embed = get_embeddings(interests)
        n = row["First Name"].strip() + " " + row["Last Name"].strip()
        embedding_dict[n] = embed

        sleep(0.5)

with open("./embeddings.pickle", "wb") as f:
    pickle.dump(embedding_dict, f)