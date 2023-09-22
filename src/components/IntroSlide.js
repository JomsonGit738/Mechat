import React from 'react'

function IntroSlide() {
    return (
        <div className="intro-slide">
            <div className='singinImage' style={{ backgroundColor: 'transparent' }}>
                <img src="https://i.postimg.cc/wjjTDwgj/chat.png" alt="" />
                <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>MeChat</h1>
                <p style={{ fontSize: '22px' }}>Let's chit chat 😉😆😉😮 on MeChat!</p>
                <span style={{ fontSize: '15px' }}>Welcome to Mechat Chat! Connect with friends and colleagues in real-time.</span>
            </div>
        </div>
    )
}

export default IntroSlide