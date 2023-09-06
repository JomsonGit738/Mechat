import React, { useContext, useEffect, useState } from 'react'
import { Avatar, MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { userContext } from './ContextShare';
import { useDispatch } from 'react-redux';
import {setUser,setFriends,setChat} from '../features/slice'

function Header() {

  const dispatch = useDispatch()
  const { setActiveUser, setSelectedChat, setChats } = useContext(userContext)
  const [loggedUser, setLoggedUser] = useState('')
  const navigate = useNavigate()
  

  const SignOutUser = () => {
    
    setActiveUser('')
    setSelectedChat('')
    setChats('')

    dispatch(setUser({}))
    dispatch(setFriends([]))
    dispatch(setChat({}))

    sessionStorage.removeItem('userInfo')
    navigate('/')
  }

  useEffect(() => {
    var user = JSON.parse(sessionStorage.getItem('userInfo'))
    setLoggedUser(user)
  }, [])


  return (
    <div className='header'>
      <div className='header-brand'>
        <img src="https://i.postimg.cc/wjjTDwgj/chat.png" alt="" />
        <h3>MeChat</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h4>Hi, {loggedUser.username}</h4>
        {/* <img width={'40px'} src={user.url} alt="" /> */}
        {/* <Avatar width={'40px'} size='2xs' cursor="pointer" name={user.username} src={user.url} /> */}

        <Menu isLazy >
          <MenuButton ml={3} mr={4} >
            <Avatar bg='teal.500' size='sm' cursor="pointer" name={loggedUser.username} src={loggedUser.url} />
          </MenuButton>
          <MenuList>
            {/* MenuItems are not rendered unless Menu is open */}
            <MenuItem>My Profile</MenuItem>
            <MenuItem onClick={SignOutUser}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}

export default Header