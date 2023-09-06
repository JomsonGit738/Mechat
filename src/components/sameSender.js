
const sameSender = (mess,m, i, userId) => {
 // console.log(mess[mess.length-1]);
  return (
    i < mess.length - 1 
    && (mess[i+1].sender._id !== m.sender._id ||
        mess[i+1].sender._id === undefined) &&
        mess[i].sender._id !== userId
       
  )
}

export default sameSender