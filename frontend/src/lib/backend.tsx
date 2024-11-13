import axios from "axios"

const backend_url = "http://localhost:8765/"

export async function GET (
    routeName:string,
    body:any
) {
    axios.get(backend_url + routeName, {
        params: body
    })    
}