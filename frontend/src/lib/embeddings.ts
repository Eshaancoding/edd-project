import axios from "axios"

// call Jina Free API to embed interests
export async function getEmbeddings(interests:string[]) {
    const url = 'https://api.jina.ai/v1/embeddings';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer jina_7818739f02b4474b95ef60de3f5a7ecb5E9xjJj2xAFNzcbr22g8WtFQ7_H7'
    };
    
    const data = {
        "model": "jina-embeddings-v3",
        "task": "text-matching",
        "dimensions": 1024,
        "late_chunking": true,
        "embedding_type": "float",
        "input": interests
    };

    try {
        const response = await axios.post(url, data, { headers });
        const d = response.data.data;

        // Initialize an array of zeros for the embeddings
        let ems = new Array(1024).fill(0); // Array of 1024 zeros

        // Loop through the response data to accumulate embeddings
        for (let i = 0; i < d.length; i++) {
            for (let j = 0; j < 1024; j++) {
                ems[j] += d[i].embedding[j]; // Accumulate embedding values
            }
        }

        // Average the embeddings (divide each element by 5 as in original code)
        for (let i = 0; i < 1024; i++) {
            ems[i] /= 5;
        }

        return ems; // Return the final embeddings array
    } catch (error) {
        console.error("Error fetching embeddings:", error);
        return null;
    }
}