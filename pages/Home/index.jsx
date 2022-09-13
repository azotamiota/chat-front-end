import React from 'react'
import {useNavigate} from 'react-router-dom'
import io from 'socket.io-client'

import styles from './index.module.css' 
// const socket = io.connect('https://millionare-chat.herokuapp.com/')
const socket = io.connect('http://localhost:5000')
console.log('socket: ', socket)


function Home() {

  const [username, setUsername] = React.useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    console.log('submitted')
    socket.emit('user_started_chat', {username: username})
    navigate(`/chat/${username}`)
  }

  return ( <>
    <div className='container'>
      <h2>Simple Chat</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Choose a nickname:</label><br></br>
        <input type="text" name="username" id="username" placeholder='Enter a username...' onChange={(e) => setUsername(e.target.value)} value={username}/><br></br>
        <input type="submit" value="Start to chat" className='m-4 btn btn-primary'/>
      </form>
    </div>
  </>
  )
}

export default Home
