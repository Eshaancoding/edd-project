export async function callLLM(interests: string[]) {
    let result = await fetch("https://api.arliai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_ARLI}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "Meta-Llama-3.1-8B-Instruct",
            "messages": [
                { "role": "system", "content": "Your job is create ONE question starter that discusses a common interests across multiple people. Just give the staring question. No explanation. Give ONE informal question starters, as it is an informal conversation." },
                { "role": "user", "content": `The interests are ${interests.join(", ")}. Create ONE question starter off of these interests. Just give ONE staring question. No explanation. Give ONE informal question starters, as it is an informal conversation.` },
            ],
            "repetition_penalty": 1.1,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_tokens": 1024,
            "stream": false
        })
    }) 

    result = await result.json()
    
    return result["choices"][0]["message"]["content"]
}
