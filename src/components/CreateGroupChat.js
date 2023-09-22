import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CreateNewGroupChat, SearchUserData } from '../services/apiCalls'
import UserMenuList from './UserMenuList'
import { TiDeleteOutline } from 'react-icons/ti'

function CreateGroupChat({ setMyFriends }) {

    const user = useSelector(state => state.activeUser)
    const [groupName, setGroupName] = useState('')
    const [groupMembers, setGroupMembers] = useState([])
    const [searchName, setSearchName] = useState('')
    const [result, setResult] = useState([])

    async function handleSearch(nameOfmember) {
        setSearchName(nameOfmember)
        if (!nameOfmember) return

        try {

            const headerConfig = {
                token: user.token
            }
            const { data } = await SearchUserData(nameOfmember, headerConfig)
            //console.log(data)
            setResult(data)
        } catch (error) {
            alert('error cl')
            console.log(error)
        }

    }

    function handleGroupMembers(member) {
        const isDuplicate = groupMembers.some((item) => item.username === member.username);
        if (isDuplicate) {
            alert('user is already included')
            return;
        } else {
            //console.log(member)
            setGroupMembers((members) => [...members, member])
        }

    }

    function handleDeleteGroupMember(id) {
        setGroupMembers((members) => members.filter((m) => m._id !== id))
    }

    async function handleGroupCreation() {
        //console.log(groupMembers.length)
        if (!groupName || groupMembers.length === 0) {
            alert('empty field found')
            return
        }
        // if (groupMembers.length < 3) {
        //     alert('Minimum 3 friends required to create new Group')
        //     return
        // }
        try {
            const header = {
                token: user.token
            }
            const body = {
                name: groupName,
                users: JSON.stringify(groupMembers.map((user) => user._id))
            }
            const { data } = await CreateNewGroupChat(body, header)

            // Home => chatbody => createGroupChat
            setMyFriends((friends) => [data, ...friends])

        } catch (error) {
            alert('error cl')
            console.log(error)
        }
    }

    return (
        <div className="group-create-container">
            <div className='group-form'>
                <h3>🙋‍♂️Create Group Chat🙎‍♂️</h3>
                <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    type="text" placeholder='Type GroupChat name ' />
                {
                    groupMembers.length > 0 &&
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {
                            groupMembers.slice().map((m) =>
                                <span key={m._id} style={{ display: 'inline-flex' }}>
                                    {m.username}
                                    <span
                                        onClick={() => handleDeleteGroupMember(m._id)}
                                        style={{ alignSelf: 'center', color: 'red', cursor: 'pointer' }}>
                                        <TiDeleteOutline />
                                    </span>
                                </span>
                            )
                        }
                    </div>
                }
                <span style={{ position: 'relative' }}>
                    <input
                        value={searchName}
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        placeholder='Add friend'
                    />
                    {
                        (result.length !== 0 && searchName !== '')
                        &&
                        <UserMenuList result={result} setSearchName={setSearchName} handleGroupMembers={handleGroupMembers} />
                    }
                </span>
                <button
                    onClick={handleGroupCreation}>Create Group</button>
            </div>
        </div>
    )
}

export default CreateGroupChat