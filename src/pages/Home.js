import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Home.css'
import ChatBody from '../components/ChatBody';
import { DeleteChatfromUser, FetchChats } from '../services/apiCalls';
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';




function Home() {

    const myuser = useSelector(state => state.activeUser)
    const [selectedChat, setSelectedChat] = useState('')
    const [myfriends, setMyFriends] = useState([])
    const [isGroupOpen, setIsGroupOpen] = useState(false)

    function onHandleLastMessage(m, id) {
        setMyFriends((friends) => friends.map((friend) =>
            friend._id === id
                ? { ...friend, latestMessage: { ...friend.latestMessage, content: m } }
                : friend
        ))
    }
    async function onHandleDeleteChat(id) {
        const headerConfig = {
            token: myuser.token
        }
        await DeleteChatfromUser(id, headerConfig)
        setSelectedChat('')
        setMyFriends((friends) => friends.filter(friend => friend._id !== id))

    }
    //fetch friends of user
    const fetchUserChats = async () => {
        const headerConfig = {
            token: myuser.token
        }
        const { data } = await FetchChats(headerConfig)
        setMyFriends(data)
    }
    //rename GroupChat
    function handleRenameGroupChat(name) {
        setMyFriends(friends =>
            friends.map((item) => item._id === selectedChat._id ? { ...item, chatName: name } : item));
        setSelectedChat('')
    }
    //handleUpdate/refresch chats/myfriends
    function handleChatRefresh() {
        setSelectedChat('')
        fetchUserChats()
    }
    useEffect(() => {
        fetchUserChats()
        // eslint-disable-next-line
    }, [])

    return (
        <div className='App'>
            <div className='App_body'>
                <Header />
                {/* <div className='sticky-space'></div> */}
                <div className='chatSection'>
                    <Sidebar
                        setIsGroupOpen={setIsGroupOpen}
                        selectedChat={selectedChat}
                        friends={myfriends}
                        onSelectedChat={setSelectedChat}
                        onFriendsAdd={setMyFriends} />

                    <ChatBody
                        handleChatRefresh={handleChatRefresh}
                        handleRenameGroupChat={handleRenameGroupChat}
                        setMyFriends={setMyFriends}
                        isGroupOpen={isGroupOpen}
                        setIsGroupOpen={setIsGroupOpen}
                        selectedChat={selectedChat}
                        onLastMessage={onHandleLastMessage}
                        onHandleDeleteChat={onHandleDeleteChat} />


                </div>
            </div>
            <ToastContainer />
        </div>

    )
}

export default Home