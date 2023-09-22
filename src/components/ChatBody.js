import React, { useEffect, useState } from "react";
import { ReceiveAllMessages, sendMessagesUser } from "../services/apiCalls";
import sameSender from "./sameSender";
import ScrollableFeed from "react-scrollable-feed";
import { VscSend } from 'react-icons/vsc'
import EmojiPicker from "emoji-picker-react";
import { GrEmoji } from 'react-icons/gr'
import { ThreeDots } from 'react-loader-spinner'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { Menu, MenuButton } from '@szhsin/react-menu';
import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client'
import lastSender from "./lastSender";
import sameUser from "./sameUser";
import GetTime from "./GetTime";
import CreateGroupChat from "./CreateGroupChat";
import IntroSlide from "./IntroSlide";
import GroupDetails from "./GroupDetails";
import FriendDetails from "./FriendDetails";
import { baseUrl } from "../services/baseUrl";
// const Endpoint = "http://localhost:4000"
const Endpoint = baseUrl
var socket, selectedChatCompare;

function ChatBody({ selectedChat, handleChatRefresh, onLastMessage, onHandleDeleteChat, isGroupOpen, setMyFriends, handleRenameGroupChat }) {

  const [isTyping, setIsTyping] = useState(false)
  const [typing, setTyping] = useState(false)
  const [socketConnected, setsocketConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessages, setNewMessages] = useState('')
  const [loggedUser, setLoggedUser] = useState('')
  const [isOpen, setIsOpen] = useState(false)



  //fetch all messages
  const fetchallmessages = async () => {

    let current_user = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!selectedChat) {
      return
    }
    const headerConfig = {
      token: current_user.token
    }

    const { data } = await ReceiveAllMessages(selectedChat._id, headerConfig)
    setMessages(data)

    socket.emit('join chat', selectedChat._id);
  }

  //send message to user
  const sendMess = async (e) => {

    e.preventDefault()

    if (newMessages) {
      socket.emit('stop typing', selectedChat._id)
      const headerConfig = {
        token: loggedUser.token
      }
      const body = {
        content: newMessages,
        chatId: selectedChat._id
      }

      const { data } = await sendMessagesUser(body, headerConfig)
      setNewMessages('')
      setMessages(prevMessages => [...prevMessages, data])
      const friendId = selectedChat._id
      socket.emit('newMessage', { data, friendId })
      onLastMessage(data.content, selectedChat._id)

    } else {
      toast.error('Type a message to send!', {
        position: "bottom-left",
        hideProgressBar: true,
        autoClose: 1500,
        theme: "colored",
        transition: Flip
      });
    }
  }

  //typing logic /animation
  const chatUserInput = (e) => {
    setNewMessages(e.target.value)

    //typing animation logic
    if (!socketConnected) {
      return
    }
    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timerLength)

  }

  useEffect(() => {
    socket = io(Endpoint);
    socket.emit('setup', JSON.parse(sessionStorage.getItem('userInfo')));
    socket.on('connection', () => setsocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])


  useEffect(() => {
    setLoggedUser(JSON.parse(sessionStorage.getItem('userInfo')))
    const isObjectEmpty = Object.keys(selectedChat).length === 0;
    if (!isObjectEmpty) {
      fetchallmessages()
      //just a backup
      selectedChatCompare = selectedChat
    }
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    const messageListener = ({ newMessageReceived, friendId }) => {
      //console.log('<= no of times');
      if (!selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id) {
        //notification
      } else {
        //console.log(messages);
        //console.log(newMessageReceived);
        setMessages(prevMessages => [...prevMessages, newMessageReceived]);
        onLastMessage(newMessageReceived.content, friendId)
      }
    }
    socket.on('message received', messageListener)

    return () => {
      socket.off('message received', messageListener)
    }
    // eslint-disable-next-line
  }, [socket]);


  // if (Chat_selected.length > 0) return <span>hai</span>
  //console.log(messages[messages.length - 1]);
  //new Date(c.updatedAt).getHours()

  return (
    < div className="chat_body" >

      {selectedChat ?
        <div className="chat_box">
          {/* chat sender header */}
          <div div className="chat_head" >
            {
              selectedChat ?
                <div className="chat_sender">
                  <div className="chat_sender_title">
                    {!selectedChat.isGroupChat ?
                      <>
                        <img
                          alt={selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].username : selectedChat.users[0].username}
                          src={selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].url : selectedChat.users[0].url} />
                        <p>{selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].username : selectedChat.users[0].username}</p>
                      </>
                      :
                      <>
                        <img
                          alt={selectedChat.chatName}
                          src={'https://www.gtcc.edu/_images/Admissions%20and%20Aid%20Photos/group_icon_400x400.jpg'} />
                        <p>{selectedChat.chatName}</p>
                      </>
                    }
                    <span>
                      {isTyping && <ThreeDots
                        color="#fff"
                        height='25'
                        width='35' />}
                    </span>
                  </div>
                  {/* <span style={{ fontSize: '22px', color: 'white' }}><BiDotsVerticalRounded /></span> */}
                  <Menu
                    arrow={true}
                    direction={"left"}
                    menuButton={<MenuButton className={'chat-head-menu'}>
                      <span style={{ fontSize: '22px', color: 'white' }}>
                        <BiDotsVerticalRounded /></span>
                    </MenuButton>} transition>
                    {
                      !selectedChat.isGroupChat ?
                        <FriendDetails
                          selectedChat={selectedChat}
                          loggedUser={loggedUser}
                          onHandleDeleteChat={onHandleDeleteChat} />
                        : <GroupDetails
                          handleChatRefresh={handleChatRefresh}
                          selectedChat={selectedChat}
                          handleRenameGroupChat={handleRenameGroupChat} />

                    }
                  </Menu>
                </div>
                : <></>
            }
          </div >
          {/* chats one to one */}
          <div div className="chats" >

            <ScrollableFeed className="scroll-chats">
              {
                messages && messages.map((m, i) => (
                  <div
                    className="msg"
                    id={`${loggedUser.id === m.sender._id ? "you" : "friend"}`}
                    style={{ marginTop: sameUser(messages, m, i) ? '0px' : '10px' }}
                    key={i}>
                    <div className="msg-container">
                      <p>{m.content} <span style={{ fontSize: '8px' }}>{GetTime(m)}</span></p>
                      {
                        sameSender(messages, m, i, loggedUser.id)
                          || lastSender(messages, i, loggedUser.id)
                          ? <span>{m.sender.username}</span> : ''}
                    </div>
                  </div>
                ))
              }
              <div style={{ widows: '100%', height: '150px' }}></div>
            </ScrollableFeed>

          </div >
          {/* input type message */}
          <div div className="type" >

            <form onSubmit={sendMess}
              className="type-body">
              {isOpen &&
                <div className="picker">
                  <EmojiPicker onEmojiClick={(emo) => setNewMessages(a => a + emo.emoji)} />
                </div>}
              <span onClick={() => setIsOpen(!isOpen)}><GrEmoji /></span>
              <input
                // onChange={typing}
                value={newMessages}
                type="text"
                onChange={chatUserInput}
                placeholder="Type a message"
                onClick={() => setIsOpen(false)}
              />
              <button><VscSend /></button>
            </form>
            {/* <button onClick={sendMess} type="button">Send</button> */}

          </div >
        </div>
        : (isGroupOpen
          ? <CreateGroupChat setMyFriends={setMyFriends} />
          : <IntroSlide />
        )
      }

    </div >
  );
}

export default ChatBody;
