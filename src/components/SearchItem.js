import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const SearchItem = ({user,handleFunction}) => {
  return (
    <Box
    onClick={handleFunction}
      cursor="pointer"
      p={1}
      borderRadius={6}
      _hover={{
        background: "#24B8F2",
        color: "white",
      }}>
        <div
        style={{width:'100%', height:'100%',display:"flex",
        padding:'2px',alignItems:'center'}}>
           <Avatar
            mr={2}
            size="md"
            cursor="pointer"
            name={user.username}
            src={user.url}
          /> 
          <div 
          style={{display:'flex',
          flexDirection:'column',
          justifyContent:'center'
          
          }}>
            <Text as='b' fontSize='sm'>{user.username}</Text>
            <Text fontSize='xs'>{user.email}</Text>
          </div>
        </div>
    </Box>
  )
}

export default SearchItem