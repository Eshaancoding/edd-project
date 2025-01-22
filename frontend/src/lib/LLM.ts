import axios from "axios"

// Call large language model to generate conversation starters given interest
export async function callLLM(interests: string[]) {
    const MODEL_ENDPOINT = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions'; // Adjust if hosted differently

    const response = await axios.post(
        MODEL_ENDPOINT,
        {
            "model": "mistralai/Mistral-7B-Instruct-v0.3",
            "messages": [
                { "role": "system", "content": `Generate a natural and engaging conversation starter between two people who share the following 10 interests: ${interests.join(", ")}. The starter should feel casual, thoughtful, and appropriate for an initial conversation, sparking further dialogue about these shared topics.`},
                { "role": "user", "content": `The interests are ${interests.join(", ")}. Give no explanation. Don't go over 20 words.` }
            ],
            "repetition_penalty": 1.1,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_tokens": 75,
            "stream": false
        },
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE}`,
                'Content-Type': 'application/json',
                "x-use-cache": "false" // to prevent caching and generate new responses every time
            },
        }
    )
    
    const result = response.data

    let ret_str = result["choices"][0]["message"]["content"] as string
    return ret_str.substring(1, ret_str.length - 1) // remove the quotations around
}

// Call large language model to generate conversation starters given interest (equipped with custom prompt; this is used for finetuning prompt during production)
export async function callLLMCustom (interests: string[], customPrompt:string) {
    const MODEL_ENDPOINT = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions'; // Adjust if hosted differently

    const response = await axios.post(
        MODEL_ENDPOINT,
        {
            "model": "mistralai/Mistral-7B-Instruct-v0.3",
            "messages": [
                { "role": "system", "content": customPrompt },
                { "role": "user", "content": `The interests are ${interests.join(", ")}.` }
            ],
            "repetition_penalty": 1.1,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_tokens": 75,
            "stream": false
        },
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE}`,
                'Content-Type': 'application/json',
                "x-use-cache": "false" // to prevent caching and generate new responses every time
            },
        }
    )
    
    const result = response.data

    let ret_str = result["choices"][0]["message"]["content"] as string
    return ret_str.substring(1, ret_str.length - 1) // remove the quotations around
}