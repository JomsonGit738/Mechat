import React from 'react'

const SearchItem = ({ user, handleFunction }) => {
  return (

    <div onClick={handleFunction} className='search-result-item'>
      <img
        style={{
          height: '50px',
          width: '50px',
          borderRadius: '50%',
          objectFit: 'cover',
          margin: '0px 10px'
        }}
        src={user.url}
        alt={user.username}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'

        }}>
        <p style={{ fontWeight: 'bold', margin: '0' }}>{user.username}</p>
        <p style={{ fontSize: '12px', margin: '0' }}>{user.email}</p>
      </div>
    </div >

  )
}

export default SearchItem