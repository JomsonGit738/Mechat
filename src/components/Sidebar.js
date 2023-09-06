import React, { useContext, useEffect, useState } from 'react'
import { Search2Icon, CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Input, InputGroup, InputLeftElement, InputRightElement, useToast } from '@chakra-ui/react';
import { userContext } from './ContextShare';
import { AccessChats, SearchUserData } from '../services/apiCalls';
import SkeltonSearch from './SkeltonSearch';
import SearchItem from './SearchItem';
import { useDispatch, useSelector } from 'react-redux';
import { setChat, setFriends } from '../features/slice';

function Sidebar() {

    const styles = {
       backgroundColor:"red"
    }
    const styles1 = {
        backgroundColor:"Green"
     }

     const dispatch = useDispatch()
     const friends = useSelector(state => state.activeFriends)
     const chat = useSelector(state => state.activeChat)
     //console.log(friends);

    //const [myfriends,setMyfriends] = useState('')
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [loggedUser,setLoggedUser] = useState('')
    //contextAPI
    //const { selectedChat, setSelectedChat, chats, setChats } = useContext(userContext)
    const [loading, setLoading] = useState(false)
    const [skelt, setSkelt] = useState(false)
    const [result, setResult] = useState([])


    // const sidebarDate = [
    //     {
    //         title: "Rohit Sharma",
    //         icon: "",
    //         link: "/",
    //         room: "none"
    //     },
    //     {
    //         title: "Chotta Vheen",
    //         icon: "",
    //         link: "/",
    //         room: ""
    //     },
    //     {
    //         title: "Linus Timothy",
    //         icon: "",
    //         link: "/",
    //         room: ""
    //     },
    //     {
    //         title: "Linus Timothy",
    //         icon: "",
    //         link: "/",
    //         room: ""
    //     },
    //     {
    //         title: "Linus Timothy",
    //         icon: "",
    //         link: "/",
    //         room: ""
    //     }

    // ]

    // const toggle = () => setIsOpen(!isOpen)
    const searchUser = async () => {
        if (!search) {
            toast({
                title: `Type Name/Email`,
                position: 'top',
                status: 'info',
                duration: 2000,
                isClosable: true,
                render: () => (
                    <Box color='white' borderRadius='lg' radii='md' p={3} bg='#1BB3F5'>
                        Type Name/Email
                    </Box>
                ),
            })
            //toast
        } else {

            setResult([])
            setSkelt(true)
            setLoading(false)
            //api call to search
            const headerConfig = {
                token: loggedUser.token
            }

            const { data } = await SearchUserData(search, headerConfig)
            console.log(data);
            if (data) {
                //setLoading(false)
                toast({ title: 'data found', duration: 1000 })
                setResult(data)
            } else {
                setResult([])
                setTimeout(() => {
                    setLoading(true)
                }, 2500)
                toast({ title: 'not found', duration: 1000 })
            }
        }
    }

    const cancelSearch = () => {
        setSearch('')
        //setLoading(false)
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
                //setChats([data, ...chats])
                dispatch(setFriends([data, ...friends]))
            }
            //setSelectedChat(data)
            dispatch(setChat(data))
            setSearch('')
            setSkelt(false)
        }
    }

    useEffect(()=>{
        setLoggedUser(JSON.parse(sessionStorage.getItem('userInfo')))
    },[])

    // useEffect(()=>{
    //     //setMyfriends(friends)
    //     //console.log(myfriends);
    // },[friends])

    return (
        <div className='sidebar'>

            <ul>
                <h6>Chats</h6>
                {/* search user name or Email */}
                <div className='search'>
                    <InputGroup>
                        <InputLeftElement onClick={searchUser}
                            style={{ cursor: "pointer" }}>
                            <Search2Icon color='#000' />
                        </InputLeftElement>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            variant='flushed'
                            type='text'
                            placeholder='Search Friends' />
                        {
                            search &&
                            <InputRightElement onClick={cancelSearch} style={{ cursor: "pointer" }}>
                                <CloseIcon w={3} h={3} />
                            </InputRightElement>
                        }
                    </InputGroup>
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
                            (<SkeltonSearch />)
                            : (<div>not found</div>)
                        )
                    )

                }
                {/* chat list friends */}
                {

                    !skelt && (friends && friends.map((c) => (
                        
                            <li
                                className='row'
                                key={c._id}
                                // onClick={() => setSelectedChat(chat)}
                                onClick={()=>dispatch(setChat(c))}
                                style={chat === c?styles:styles1}
                                >
                                <div className='icon'>
                                    <Avatar ms={2} me={2} size='md' name={c.username} src={c.users[1].url} bg='teal.500' alt="" />
                                </div>
                                <p className='title'>{c.users[0]._id === loggedUser.id ? c.users[1].username : c.users[0].username}</p>
                            </li>
                        
                    )))
                }
            </ul>
        </div>
    )
}

export default Sidebar