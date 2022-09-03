import { useState, useEffect, useRef, useReducer } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000')

function App() {

  const me = useRef(new Date().getTime())
  console.log('it is me: ', me);
   const [message, setMessage] = useState('')
   const messageContainer = useRef([])
   const [, forceUpdate] = useReducer(x => x + 1, 0);
  //  const [messagesReceived, setMessagesReceived] = useState('')
  //  const [allMessages, setAllMessages] = useState([])

  const updateAllMessages = (e) => {
    e.preventDefault();
    // messageContainer.current.push(message)
    socket.emit('send_message', [{id: me.current, message: message }])
    setMessage('')    
  }
  
  useEffect(()=>{
    
    socket.on('receive_message', (data) => {
      console.log('incoming messages from backend: ', data[0])
      messageContainer.current.push(data[0])
      console.log('current messagesREceived: ', messageContainer.current[0])
      // setAllMessages([...allMessages, messageReceived])
      
        forceUpdate()
      
      })
  },[socket])




  return (
    <div className="App">
      <h1>Message:</h1>
      {messageContainer.current.map(message => <div className={message.id === me.current ? 'my-message' : 'foreign-message'} key={Math.random()}>{message.message}</div>)}
    <form className='chat-input' onSubmit={updateAllMessages}>
      <input type='text' placeholder='Send your message...' onChange={(e) => {setMessage(e.target.value)}} value={message} required/>
      <input type='submit' value='Send Message'/>
    </form>
    </div>
  )
}

export default App
