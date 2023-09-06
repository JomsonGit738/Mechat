import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeUser: {},
    activeFriends: [],
    activeChat: {}
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUser: (state, action) =>{
            state.activeUser = action.payload
        },
        setFriends: (state,action) =>{
            state.activeFriends = action.payload
        },
        setChat: (state,action) =>{
            state.activeChat = action.payload
        }
    }
})

export const {setUser,setFriends,setChat} = userSlice.actions

export default userSlice.reducer