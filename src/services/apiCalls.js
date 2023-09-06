import { httpRequest } from "./httpRequest";
import { baseUrl } from "./baseUrl";

export const registerUser = async (body)=>{
    return await httpRequest("POST",`${baseUrl}/register`,body)
}

export const uniqueEmail = async (body)=>{
    return await httpRequest("POST",`${baseUrl}/unique`,body)
}

export const loginUser = async (body)=>{
    return await httpRequest("POST",`${baseUrl}/login`,body)
}

export const GoogleSignInUser = async (body)=>{
    return await httpRequest("POST",`${baseUrl}/googlesignin`,body)
}

export const SearchUserData = async (search,header)=>{
    return await httpRequest("GET",`${baseUrl}/search-user?search=${search}`,"",header)
}

export const AccessChats = async (body,header)=>{
    return await httpRequest("POST",`${baseUrl}/chat`,body,header)
}

export const FetchChats = async (header)=>{
    return await httpRequest("GET",`${baseUrl}/chat`,"",header)
}

export const sendMessagesUser = async (body,header)=>{
    return await httpRequest('POST',`${baseUrl}/msg`,body,header)
}

export const ReceiveAllMessages = async (chatId,header) =>{
    return await httpRequest('GET',`${baseUrl}/msg/${chatId}`,"",header)
}