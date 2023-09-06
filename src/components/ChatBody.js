import React, { useEffect, useState } from "react";
import { ViewIcon } from "@chakra-ui/icons"
import { Avatar, Input } from "@chakra-ui/react";
import { ReceiveAllMessages, sendMessagesUser } from "../services/apiCalls";
import sameSender from "./sameSender";
import ScrollableFeed from "react-scrollable-feed";

import io from 'socket.io-client'
import { useSelector } from "react-redux";
import lastSender from "./lastSender";
import sameUser from "./sameUser";
const Endpoint = "http://localhost:4000"
var socket, selectedChatCompare;

function ChatBody() {

  const [isTyping, setIsTyping] = useState(false)
  const [typing,setTyping] = useState(false)
  const [socketConnected, setsocketConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessages, setNewMessages] = useState('')
  const [loggedUser, setLoggedUser] = useState('')
  
  const Chat_selected = useSelector(state=>state.activeChat)
  //console.log(friendChat);
  //context
  //const { selectedChat } = useContext(userContext);
 

  //fetch all messages
  const fetchallmessages = async () => {

    let current_user = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!Chat_selected) {
      return
    }
    const headerConfig = {
      token: current_user.token
    }
    //console.log(current_user.token);

    const {data} = await ReceiveAllMessages(Chat_selected._id, headerConfig)
    //console.log('asdffasfdffdffadfafafdasfdfsdfafffasfafsdfdfsfsfsfsf');
    setMessages(data)

    socket.emit('join chat',Chat_selected._id);
  }

 

  

  //send message to user
  const sendMess = async () => {

    if (newMessages) {
      socket.emit('stop typing',Chat_selected._id)
      const headerConfig = {
        token: loggedUser.token
      }
      const body = {
        content: newMessages,
        chatId: Chat_selected._id
      }
      
      const {data} = await sendMessagesUser(body, headerConfig)
      //console.log(sendResponse);
        setNewMessages('')
        // setMessages([...messages, data])
        setMessages(prevMessages => [...prevMessages,data])
        socket.emit('newMessage',data)
       
    } else {
      alert('no message found to send')
    }
  }

  //typing logic /animation
  const chatUserInput = (e) => {
    setNewMessages(e.target.value)

    //typing animation logic
    if(!socketConnected){
      return
    }
    if(!typing){
      setTyping(true)
      socket.emit('typing',Chat_selected._id);
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime

      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing',Chat_selected._id)
        setTyping(false)
      }
    },timerLength)

  }

  useEffect(()=>{
    socket = io(Endpoint);
    socket.emit('setup',JSON.parse(sessionStorage.getItem('userInfo')));
    socket.on('connection',()=>setsocketConnected(true))
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  },[])
  

  useEffect(() => {
    setLoggedUser(JSON.parse(sessionStorage.getItem('userInfo')))
    const isObjectEmpty = Object.keys(Chat_selected).length === 0;
    if(!isObjectEmpty)
    {
      fetchallmessages()
    //just a backup
    selectedChatCompare = Chat_selected
    }
  }, [Chat_selected]);

  useEffect(()=>{
    const messageListener = (newMessageReceived) =>{
      //console.log('<= no of times');
      if(!selectedChatCompare || 
        selectedChatCompare._id !== newMessageReceived.chat._id){
        //notification
      } else {
        //console.log(messages);
        //console.log(newMessageReceived);
        setMessages(prevMessages => [...prevMessages,newMessageReceived]);
      }
    }
    socket.on('message received', messageListener)
    
    return () =>{
      socket.off('message received', messageListener)
    }
  },[socket]);

  

  return (
    <div className="chat_body">
      {/* <div className='chat_head'>chat head user</div> */}
      <div className="chat_box">
        {/* chat sender header */}
        <div className="chat_head">
          {
           Chat_selected && Chat_selected.users ? 
              <div className="chat_sender">
                <div className="chat_sender_title">
                  <Avatar
                    size='md'
                    name={Chat_selected.users[0]._id === loggedUser.id ? Chat_selected.users[1].username : Chat_selected.users[0].username}
                    src={Chat_selected.users[0]._id === loggedUser.id ? Chat_selected.users[1].url : Chat_selected.users[0].url} />
                  <p>{Chat_selected.users[0]._id === loggedUser.id ? Chat_selected.users[1].username : Chat_selected.users[0].username}</p>
                  <span>{isTyping?'loading...':''}</span>
                </div>
                <ViewIcon />
              </div>
              : <div>
                select a chat to start chat

              </div>
          }
        </div>
        {/* chats one to one */}
        <div className="chats">

          <ScrollableFeed className="scroll-chats">
            {
              messages && messages.map((m, i) => (
                <div
                className="msg"
                id={loggedUser.id === m.sender._id ? "you" : "friend"}
                style={{marginTop:sameUser(messages,m,i)?'0px':'10px'}}
                key={i}>
                  <div className="msg-container">
                    <p>{m.content}</p>
                   { 
                    sameSender(messages,m,i,loggedUser.id) 
                    || lastSender(messages,i,loggedUser.id)
                    ?  <span>{m.sender.username}</span>:'' }
                  </div>
                </div>
              ))
            }
          </ScrollableFeed>

        </div>
        {/* input type message */}
        <div className="type">
          <div className="type-body">
            <Input
              // onChange={typing}
              value={newMessages}
              type="text"
              onChange={chatUserInput}
              placeholder="Message"
               />
            <button onClick={sendMess} type="button">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBody;
