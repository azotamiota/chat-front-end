import { useState, useEffect, useRef } from 'react'

import io from 'socket.io-client'

import styles from './index.module.css' 
// const socket = io.connect('https://millionare-chat.herokuapp.com/')
const socket = io.connect('http://localhost:5000')
console.log('socket: ', socket)

function Chat() {
  
  // const me = useRef(new Date().getTime())
  const inputRef = useRef(null);
  const [messageContainer, setMessageContainer] = useState([])
  const [message, setMessage] = useState('')
  const [usersOnline, setUsersOnline] = useState([])
 
   const updateAllMessages = (e) => {
     e.preventDefault();
     socket.emit('send_message', {id: me.current, message: message })
     setMessage('')    
    }
    
  useEffect(()=>{
    inputRef.current.focus();
    socket.on('receive_message', (data) => {
        setMessageContainer((prev) => [...prev, data])
      })

    socket.on('user_joined_chat', data => {
      console.log('this is the user data from main - backend - chat backend: ', data)
      setUsersOnline((prev) => {
        return [...prev, data]
      })
    })

    socket.on('updated_user_list', (data) => {
      console.log('incoming updated user list: ', data)
       setUsersOnline((prev) => {
        return [...prev, data]
       })
    })

  },[socket])

  useEffect(() => {
    console.log('all_online_users emitted to backend: ',usersOnline);
    socket.emit('all_online_users', usersOnline)
  }, [usersOnline])

  return (
    <div className={styles['card']}>
      <ul>
      { usersOnline.map(onlineUser => {
        // console.log('onlineUSer: ', onlineUser)
        return <li key={Math.random()}>{onlineUser.username}</li>
      })}
      </ul>
      {messageContainer.map(message => <div className={message.id === me.current ? styles['my-message'] : styles['foreign-message']} key={Math.random()}>{message.message}</div>)}
        <form className='chat-input' onSubmit={updateAllMessages}>
        <input ref={inputRef} type='text' placeholder='Message...' onChange={(e) => setMessage(e.target.value)} value={message} required/><br></br>
        <input className='btn btn-secondary' type='submit' value='Send'/>
        </form>
    </div>
  )
}

export default Chat
