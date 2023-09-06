import axios from "axios";

export const httpRequest = async (method,url,body,header) =>{
    let config = {
        method,
        url,
        data: body,
        headers: header ? header : {
            "Content-Type":"application/json"
        }
    }

    return axios(config)
    .then(data=>{
        return data
    })
    .catch(error=>{
        return error
    })
}