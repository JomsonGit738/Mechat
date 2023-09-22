import { MenuItem } from '@szhsin/react-menu'
import { RiDeleteBin2Line } from 'react-icons/ri'
import React from 'react'

function FriendDetails({ selectedChat, loggedUser, onHandleDeleteChat }) {
    return (
        <>
            <MenuItem disabled>
                <div className="friend-profile" >
                    <img
                        alt={selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].username : selectedChat.users[0].username}
                        src={selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].url : selectedChat.users[0].url} />
                    <p>{selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].username : selectedChat.users[0].username}</p>
                    <span>{selectedChat.users[0]._id === loggedUser.id ? selectedChat.users[1].email : selectedChat.users[0].email}</span>
                </div>
            </MenuItem>
            <MenuItem onClick={() => onHandleDeleteChat(selectedChat._id)}>
                <p style={{ color: 'red', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <RiDeleteBin2Line /> Delete</p></MenuItem>
        </>
    )
}

export default FriendDetails