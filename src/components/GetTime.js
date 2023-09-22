import React from 'react'

const GetTime = (m) => {

    const d = new Date(m.updatedAt)
    const t = d.getHours() + ":" + d.getMinutes()
    return (
        <>{t}</>
    )
}

export default GetTime