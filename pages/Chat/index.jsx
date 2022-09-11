import { useState, useEffect, useRef } from 'react'

import io from 'socket.io-client'

// const socket = io.connect('https://millionare-chat.herokuapp.com/')
const socket = io.connect('http://localhost:5000')
console.log('socket: ', socket)

function Chat() {
  
  const me = useRef(new Date().getTime())
  const inputRef = useRef(null);
  const [messageContainer, setMessageContainer] = useState([])
  const [message, setMessage] = useState('')
 
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
  },[socket])


  return (
    <div className="App">
      {console.log('messageContainer: ',messageContainer)}
      {messageContainer.map(message => <div className={message.id === me.current ? 'my-message' : 'foreign-message'} key={Math.random()}>{message.message}</div>)}
    <form className='chat-input' onSubmit={updateAllMessages}>
      <input ref={inputRef} type='text' placeholder='Message...' onChange={(e) => setMessage(e.target.value)} value={message} required/><br></br>
      <input type='submit' value='Send'/>
    </form>
    </div>
  )
}

export default Chat
