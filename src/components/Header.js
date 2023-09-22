import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { setUser, setFriends, setChat } from '../features/slice'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

function Header() {

  const dispatch = useDispatch()
  const [loggedUser, setLoggedUser] = useState('')
  const navigate = useNavigate()


  const SignOutUser = () => {

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
      <div className='header-profile'>
        <p>{loggedUser.username}</p>
        <Menu
          // menuClassName="header-menu"
          arrow={true}
          direction={'bottom'}
          menuButton={
            <MenuButton className='header-menu'>
              <img
                src={loggedUser.url}
                alt={loggedUser.username} />
            </MenuButton>
          } transition>
          <MenuItem onClick={SignOutUser}>Sign Out <AiOutlineLogout style={{ marginLeft: '5px', color: 'red' }} /></MenuItem>
        </Menu>


      </div>
    </div>
  )
}

export default Header

