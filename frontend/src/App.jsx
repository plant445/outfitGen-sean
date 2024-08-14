import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShowClothes from './pages/ShowClothes.jsx'
import CreateClothing from './pages/CreateClothing.jsx'
import DeleteItem from './pages/DeleteItem.jsx'
import RegisterUser from './pages/RegisterUser.jsx'

const App = () => {
  return (
      <Routes>
      <Route path ='/' element = {<Home/>}/>
      <Route path ='/register' element = {<RegisterUser/>}/>
      <Route path = '/items' element = {<ShowClothes/>}/>
      <Route path ='/create' element ={<CreateClothing/>}/>
      <Route path= '/delete/:id' element ={<DeleteItem/>}/>
    </Routes>
    
  )
}

export default App
