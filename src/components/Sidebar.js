import React, { useEffect, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { IoClose } from 'react-icons/io5'
import { AccessChats, SearchUserData } from '../services/apiCalls';
import SearchItem from './SearchItem';
import { BsPencilSquare } from 'react-icons/bs'
import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner'


function Sidebar({ friends, selectedChat, onSelectedChat, onFriendsAdd, setIsGroupOpen }) {

    const [search, setSearch] = useState('')
    const [loggedUser, setLoggedUser] = useState('')
    const [loading, setLoading] = useState(false)
    const [skelt, setSkelt] = useState(false)
    const [result, setResult] = useState([])


    const searchUser = async () => {
        if (!search) {
            toast.error('Type name to search!', {
                position: "bottom-left",
                hideProgressBar: true,
                autoClose: 1500,
                theme: "colored",
                transition: Flip
            });

        } else {

            setResult([])
            setSkelt(true)
            setLoading(false)

            const headerConfig = {
                token: loggedUser.token
            }

            const { data } = await SearchUserData(search, headerConfig)
            if (data.length > 0) {
                setResult(data)
            } else {
                setResult([])
                setTimeout(() => {
                    setLoading(true)
                    // toast.info('not found!', {
                    //     position: "bottom-left",
                    //     hideProgressBar: true,
                    //     autoClose: 1500,
                    //     theme: "colored",
                    //     transition: Zoom
                    // });
                }, 2500)
            }
        }
    }

    const cancelSearch = () => {
        setSearch('')
        setSkelt(false)
    }

    const accessChat = async (userId) => {
        //api call to create a chat
        const headerConfig = {
            token: loggedUser.token
        }

        const { data } = await AccessChats({ userId }, headerConfig)
        if (data) {
            if (!friends.find((ch) => ch._id === data._id)) {
                onFriendsAdd((friends) => [...friends, data])
            }
            //onFriendsAdd((friends) => [...friends, data])
            setSearch('')
            setSkelt(false)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(sessionStorage.getItem('userInfo')))
    }, [])


    return (
        <div className='sidebar'>

            <ul>

                <div className='head'>
                    <h6>My Chats </h6>
                    <BsPencilSquare
                        onClick={() => { setIsGroupOpen(true); onSelectedChat(''); }}
                        style={{ height: '20px', width: '20px', cursor: 'pointer' }} />
                </div>
                {/* search user name or Email */}
                <div className='search'>
                    <LuSearch onClick={searchUser}
                        style={{
                            width: '28px',
                            height: '28px',
                            cursor: "pointer",
                            position: 'absolute',
                            left: '5px',
                            border: 'none',
                            padding: '3px',
                            borderRadius: '5px'
                        }} />
                    <input
                        style={{ outline: 'none', fontSize: '15px', width: '75%' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant={'flushed'}
                        type={'text'}
                        placeholder={'Search Friends'} />
                    {
                        search &&
                        <IoClose
                            onClick={cancelSearch}
                            style={{
                                width: '25px',
                                height: '25px',
                                cursor: "pointer",
                                position: 'absolute',
                                right: '10px'
                            }} />

                    }
                </div>
                {
                    skelt && (result.length > 0 ?
                        // users found
                        (
                            result.map((user) => (
                                <SearchItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))

                        )

                        : (!loading ?
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Oval
                                    height={80}
                                    width={80}
                                    color="#4fa94d"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#4fa94d"
                                    strokeWidth={5}
                                    strokeWidthSecondary={5}

                                />
                            </div>
                            : (<div style={{ fontSize: '18px', color: 'red', width: '100%', display: 'flex', justifyContent: 'center' }}>Not found! Recheck the name...</div>)
                        )
                    )

                }
                {/* chat list friends */}
                {

                    !skelt && (friends && friends.map((c) => (

                        <li className={`row ${selectedChat._id === c._id ? 'selected' : ''}`}
                            key={c._id}
                            onClick={() => onSelectedChat(c)}>

                            {
                                !c.isGroupChat
                                    ?
                                    <>
                                        <img
                                            style={{ height: '50px', width: '50px', borderRadius: '50%', objectFit: 'cover', margin: '0 10px' }}
                                            src={loggedUser.id === c.users[0]._id ? c.users[1].url : c.users[0].url}
                                            alt={c.users[0]._id === loggedUser.id ? c.users[1].username : c.users[0].username} />

                                        <div className='latest-message'>
                                            <p className='title'>{c.users[0]._id === loggedUser.id ? c.users[1].username : c.users[0].username}</p>
                                            <span style={{ fontSize: '12px' }}>{c?.latestMessage?.content.slice(0, 30)}{c?.latestMessage?.content.length > 30 ? '...' : ''}</span>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className='icon'>
                                            <img
                                                style={{ height: '50px', width: '50px', borderRadius: '50%', objectFit: 'cover', margin: '0 10px' }}
                                                src={"https://www.gtcc.edu/_images/Admissions%20and%20Aid%20Photos/group_icon_400x400.jpg"}
                                                alt={c.chatName} />
                                        </div>
                                        <div className='latest-message'>
                                            <p className='title'>{c.chatName}</p>
                                            <span style={{ fontSize: '12px' }}>{c?.latestMessage?.content.slice(0, 30)}{c?.latestMessage?.content.length > 30 ? '...' : ''}</span>
                                        </div>
                                    </>
                            }
                        </li>

                    )))
                }
            </ul>
        </div>
    )
}

export default Sidebar