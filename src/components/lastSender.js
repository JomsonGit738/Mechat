
const lastSender = (mess,i, userId ) => {
    
    return (
        i === mess.length - 1 &&
        mess[mess.length - 1].sender._id !== userId &&
        mess[mess.length - 1].sender._id
    )
}

export default lastSender