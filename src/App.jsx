import React from "react";
import {Route, Routes} from 'react-router-dom'
import {Home, Chat} from '../pages'

const App = () => {
  return ( <>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/chat' element={<Chat />}></Route>
    </Routes>
  </>
  )
}

export default App;
