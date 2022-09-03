import { useState, useEffect, useRef, useReducer } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io.connect('https://millionare-chat.herokuapp.com/')

function App() {

  const me = useRef(new Date().getTime())
  const inputRef = useRef(null);
  const messageContainer = useRef([])
   const [message, setMessage] = useState('')
   const [, forceUpdate] = useReducer(x => x + 1, 0);
  

  const updateAllMessages = (e) => {
    e.preventDefault();
    socket.emit('send_message', [{id: me.current, message: message }])
    setMessage('')    
  }
  
  useEffect(()=>{
    inputRef.current.focus();
    socket.on('receive_message', (data) => {
      messageContainer.current.push(data[0])
      
      forceUpdate()
      
      })
  },[socket])


  return (
    <div className="App">
      <h1>Message:</h1>
      {messageContainer.current.map(message => <div className={message.id === me.current ? 'my-message' : 'foreign-message'} key={Math.random()}>{message.message}</div>)}
    <form className='chat-input' onSubmit={updateAllMessages}>
      <input ref={inputRef} type='text' placeholder='Send your message...' onChange={(e) => {setMessage(e.target.value)}} value={message} required/>
      <input type='submit' value='Send Message'/>
    </form>
    </div>
  )
}

export default App
