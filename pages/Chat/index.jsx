import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import io from 'socket.io-client'

import styles from './index.module.css' 
// const socket = io.connect('https://millionare-chat.herokuapp.com/')
const socket = io.connect('http://localhost:5000')

function Chat() {
  
  const fetchedUsername = useParams()
  console.log('fetchedUsername: ', fetchedUsername)
  const inputRef = useRef(null);
  const [messageContainer, setMessageContainer] = useState([])
  const [message, setMessage] = useState('')
  const [usersOnline, setUsersOnline] = useState([])
 
   const updateAllMessages = (e) => {
     e.preventDefault();
     console.log('message to be sent: ', {username: fetchedUsername.username, message: message } )
     socket.emit('send_message', {username: fetchedUsername.username, message: message })
     setMessage('')    
    }
    
  useEffect(()=>{
    inputRef.current.focus();
    socket.on('receive_message', (data) => {
      console.log('receive message in this format: ', data)
        setMessageContainer((prev) => [...prev, data])
      })

    socket.on('updated_online_users', data => {
      console.log('this is the updated online users: ', data)
      setUsersOnline(data)
    })

  },[socket])

  console.log('usersOnline: ', usersOnline)

  return (
    <div className={styles['card']}>
      <ul>
      { usersOnline.map(onlineUser => {
        return <li key={onlineUser.id}>{onlineUser.username}</li>
      })}
      </ul>
      {messageContainer.map(message => {
        return <>
          <div key={Math.random()}>{message.username}</div>
          <p key={Math.random()} className={message.username === fetchedUsername.username ? styles['my-message'] : styles['foreign-message']}>{message.message}</p>
        </>
    })}
        <form className='chat-input' onSubmit={updateAllMessages}>
        <input ref={inputRef} type='text' placeholder='Message...' onChange={(e) => setMessage(e.target.value)} value={message} required/><br></br>
        <input className='btn btn-secondary' type='submit' value='Send'/>
        </form>
    </div>
  )
}

export default Chat
