
const sameUser = (mess,m,i) => {
  return (
    i > 0 && mess[i-1].sender._id === m.sender._id
  )
}

export default sameUser