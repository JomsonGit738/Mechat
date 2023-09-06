import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Home.css'
import ChatBody from '../components/ChatBody';
import { userContext } from '../components/ContextShare'
import { FetchChats } from '../services/apiCalls';
import { useDispatch, useSelector } from 'react-redux'
import { setFriends } from '../features/slice';

function Home() {

    const myuser = useSelector(state => state.activeUser)
    const dispatch = useDispatch()
    //console.log(myuser);
    //const {activeUser, setActiveUser, selectedChat, setSelectedChat, chats, setChats} = useContext(userContext)
    const { setChats } = useContext(userContext)

    //fetch friends of all users
    const fetchUserChats = async () => {
        //let sessionUser = JSON.parse(sessionStorage.getItem("userInfo"))
        //let myuser = useSelector(state => state.activeUser)
        //console.log(myuser);
        const headerConfig = {
            token: myuser.token
        } 
        const { data } = await FetchChats(headerConfig)
        dispatch(setFriends(data))
        setChats(data)
    }


    useEffect(() => {
        fetchUserChats()
    }, [myuser])
    //[refreshChats]

    return (
        <div className='App'>
            <div className='App_body'>
                <Header />
                {/* <div className='sticky-space'></div> */}
                <div className='chatSection'>
                    <Sidebar/>

                    <ChatBody/>
                </div>
            </div>
        </div>

    )
}

export default Home