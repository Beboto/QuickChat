import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUp from './Pages/SignUp'
import ChatView from './Pages/ChatView'
import SignIn from './Pages/SignIn'
function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<SignUp/>} />
            <Route path='/chats' element={<ChatView/>} />
            <Route path='/signin' element ={<SignIn/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
