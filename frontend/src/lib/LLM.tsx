import axios from "axios"

// export async function callLLM(interests: string[]) {
//     let result = await fetch("https://api.arliai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${import.meta.env.VITE_ARLI}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             "model": "Meta-Llama-3.1-8B-Instruct",
//             "messages": [
//                 { "role": "system", "content": "Your job is create ONE question starter that discusses a common interests across multiple people. Just give the staring question. No explanation. Give ONE informal question starters, as it is an informal conversation." },
//                 { "role": "user", "content": `The interests are ${interests.join(", ")}. Create ONE question starter off of these interests. Just give ONE staring question. No explanation. Give ONE informal question starters, as it is an informal conversation.` },
//             ],
//             "repetition_penalty": 1.1,
//             "temperature": 0.7,
//             "top_p": 0.9,
//             "top_k": 40,
//             "max_tokens": 1024,
//             "stream": false
//         })
//     }) 

//     result = await result.json()

//     return result["choices"][0]["message"]["content"]
// }



export async function callLLM(interests: string[]) {
    const MODEL_ENDPOINT = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions'; // Adjust if hosted differently

    console.log(`called llm with interests: ${interests.join(", ")}`)

    const response = await axios.post(
        MODEL_ENDPOINT,
        {
            "model": "mistralai/Mistral-7B-Instruct-v0.3",
            "messages": [
                { "role": "system", "content": "Your job is to create ONE sentence starter for introverted people for informal conversations. " },
                { "role": "user", "content": `The interests are ${interests.join(", ")}. Create informal JUST ONE sentence starter that focuses on one common interests. Give no explanation. Don't go over 20 words.` }
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
    
    console.log("llm responded")

    const result = response.data

    let ret_str = result["choices"][0]["message"]["content"] as string
    return ret_str.substring(1, ret_str.length - 1) // remove the quotations around
}