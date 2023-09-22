import { MenuItem, MenuHeader, MenuDivider } from '@szhsin/react-menu'
import { TiDeleteOutline } from 'react-icons/ti'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AddNewUserToGroup, DeleteUserFromGroup, LeaveGroupChat, RenameGroupChat, SearchUserAddToGroup } from '../services/apiCalls'
import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GroupDetails({ selectedChat, handleChatRefresh, handleRenameGroupChat }) {

    const myuser = useSelector(state => state.activeUser)
    const filteredItems = selectedChat.users.filter(item => item._id !== myuser.id);
    const admin = selectedChat.groupAdmin === myuser.id
    const [name, setName] = useState('')
    const participants_count = selectedChat?.users.length
    const [participant, setParticipant] = useState('')
    const [result, setResult] = useState([])
    const [newparicipant, setNewParticipant] = useState('')

    //Delete user from Group
    async function handleDeleteUser(userId) {
        //console.log(userId)
        if (!admin) {
            alert("you are not admin")
        } else {
            const header = {
                token: myuser.token
            }
            const body = {
                userId,
                chatId: selectedChat._id
            }

            const { data } = await DeleteUserFromGroup(body, header)
            if (data) {
                handleChatRefresh()
            }
        }
    }

    async function handleRenameGroup() {
        if (name) {
            const header = {
                token: myuser.token
            }
            const body = {
                chatId: selectedChat._id,
                chatName: name
            }

            await RenameGroupChat(body, header)
            setName('')
            handleRenameGroupChat(name)

        } else {
            alert('Type name to change')
        }
    }

    async function handleSearchUser(nameOfuser) {
        setParticipant(nameOfuser)
        if (!nameOfuser) return

        const header = {
            token: myuser.token
        }
        const { data } = await SearchUserAddToGroup(nameOfuser, header)
        //console.log(data)
        if (data === null) {
            setResult([])
        } else {
            setResult(data)
        }
    }

    function handleNewParticipant(name) {
        const isPresent = filteredItems.some((item) => item.username === name)
        if (isPresent) {
            alert('user already exists in the Group')
            setParticipant('')
        } else {
            setParticipant('')
            setNewParticipant(name)
        }
    }

    async function handleAddNewUserToGroup() {
        //console.log(result)
        const header = {
            token: myuser.token
        }
        const body = {
            userId: result._id,
            chatId: selectedChat._id
        }

        const { data } = await AddNewUserToGroup(body, header)
        if (data) {
            handleChatRefresh()
        }
    }

    function handleAdminPermission() {
        if (!admin) {
            toast.warning('You are not Admin in this Group!', {
                position: "bottom-left",
                hideProgressBar: true,
                autoClose: 1500,
                theme: "colored",
                transition: Flip
            });
        }
    }
    //if you are admin please change admin id to another one
    async function handleLeaveGroup() {

        //console.log(filteredItems)
        let newAdmin;
        if (filteredItems.length > 0) {
            newAdmin = filteredItems[0]._id
        } else {
            newAdmin = myuser.id
        }
        const header = {
            token: myuser.token
        }
        const body = {
            isAdmin: admin,
            newAdmin,
            userId: myuser.id,
            chatId: selectedChat._id
        }
        //console.log(body)
        const { data } = await LeaveGroupChat(body, header)
        if (data) {
            handleChatRefresh()
        }
    }

    useEffect(() => {
        setNewParticipant('')
    }, [selectedChat])


    return (
        <React.Fragment>
            <MenuHeader>Participants{`(${participants_count})`}</MenuHeader>
            {/* <p>hai</p> */}
            <MenuDivider />
            <div className='group-list-members'>
                {
                    filteredItems?.map((user) =>
                        <MenuItem key={user._id}>
                            <div className='list-member'>
                                <img
                                    style={{ borderRadius: '50%' }}
                                    width={'40px'}
                                    height={'40px'}
                                    src={user.url}
                                    alt={user.username} />
                                <div className='list-m-details'>
                                    <p className='m-name'>{user.username}</p>
                                    <p className='m-email'>{user.email}</p>
                                </div>
                                {admin &&
                                    <span
                                        onClick={() => handleDeleteUser(user._id)}
                                        style={{ marginLeft: 'auto', fontSize: '20px', color: 'red' }}>
                                        <TiDeleteOutline />
                                    </span>
                                }
                            </div>

                        </MenuItem>
                    )

                }
            </div>
            <MenuDivider />
            <MenuHeader onClick={handleAdminPermission} style={{ cursor: 'pointer' }}>Add pariticipant</MenuHeader>
            {admin &&
                <MenuItem disabled>
                    <span className='search-group-user'>
                        {newparicipant ?
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px', border: '1px solid grey', borderRadius: '10px' }}>
                                <p style={{ color: 'black', fontWeight: 'bold' }}>{newparicipant} </p>
                                <span
                                    onClick={() => setNewParticipant('')}
                                    style={{ color: 'red', cursor: 'pointer' }}>
                                    <TiDeleteOutline />
                                </span>
                            </span>
                            :
                            <>
                                <input
                                    value={participant}
                                    onChange={(e) => handleSearchUser(e.target.value)}
                                    style={{ outline: 'none', color: 'black' }}
                                    placeholder='Type name'
                                    type="text" />
                                <div className='item'>
                                    {
                                        (result?.length !== 0 && participant !== '')
                                        &&
                                        <div
                                            onClick={() => handleNewParticipant(result?.username)}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', border: '1px solid grey', padding: '5px 5px 5px 10px', gap: '10px' }}>
                                            <img
                                                style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                                src={result?.url}
                                                alt={result?.username} />
                                            <div>
                                                <p style={{ fontWeight: 'bold', padding: '0', height: 'fit-content' }}>{result?.username}</p>
                                                <p style={{ fontSize: '12px' }}>{result?.email}</p>
                                            </div>
                                        </div>

                                    }
                                </div>
                            </>
                        }
                    </span>
                    {newparicipant &&
                        <button
                            onClick={handleAddNewUserToGroup}
                            style={{ color: 'black', backgroundColor: 'lightblue', borderRadius: '8px', padding: '8px', marginLeft: '10px', fontSize: '13px', fontWeight: 'bold' }}
                        >Add</button>
                    }
                </MenuItem>
            }
            <MenuDivider />
            <MenuHeader onClick={handleAdminPermission} style={{ cursor: 'pointer' }}>Rename GroupChat</MenuHeader>
            {admin &&
                <MenuItem disabled>
                    <input
                        style={{ outline: 'none', color: 'black' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder='Type new group name' />
                    <button
                        style={{ color: 'black', marginLeft: '5px', fontSize: '15px', fontWeight: 'bold' }}
                        onClick={handleRenameGroup}>SAVE
                    </button>
                </MenuItem>
            }
            <MenuDivider />
            <MenuItem onClick={handleLeaveGroup}>Leave Group</MenuItem>
        </React.Fragment >
    )
}

export default GroupDetails