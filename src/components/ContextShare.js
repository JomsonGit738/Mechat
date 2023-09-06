import React, { createContext, useState } from 'react'

export const userContext = createContext()

function ContextShare({children}) {

  const [activeUser, setActiveUser] = useState('')
  const [selectedChat, setSelectedChat] = useState('')
  const [chats, setChats] = useState('')

  return (
    <>
    <userContext.Provider value={{activeUser, setActiveUser,selectedChat, setSelectedChat, chats, setChats}}>
        {children}
    </userContext.Provider>
    </>
  )
}

export default ContextShare