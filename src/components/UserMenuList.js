import React from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'

function UserMenuList({ result, setSearchName, handleGroupMembers }) {
    return (
        <div className="menu-list">
            {result.map((item) => (
                <div key={item._id}
                    className='list-item'
                    onClick={() => { handleGroupMembers(item); setSearchName(''); }}>
                    <img width={'50px'} src={item.url} alt={item.name} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p>{item.username}</p>
                        <p style={{ fontSize: '12px' }}>{item.email}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '23px', marginRight: '10px' }}><AiOutlineUserAdd /></div>
                </div>
            ))
            }
        </div >
    )
}

export default UserMenuList