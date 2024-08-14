import React from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import axios from 'axios'

const Header = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
          await axios.post('http://localhost:5555/logout', {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          localStorage.removeItem('token'); // Remove token from localStorage
          navigate('/register'); // Navigate to home page
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };
  return (
    <div className='bg-gray-200 w-full h-28 flex items-center'>
        <p className='pl-10 pt-5 text-3xl font-custom'>OUTFIT GENERATOR</p>
        <div className='flex pr-5 pt-5 ml-auto'>
            <Link to='/' className='px-4 hover:underline'>HOME</Link>
            <Link to='/items' className='px-4 hover:underline'>YOUR COLLECTION</Link>
            <Link to='/create' className='px-4 hover:underline'>ADD ITEM</Link>
            <button onClick={handleLogout} className='px-4 hover:underline'>LOG OUT</button>
        </div>
    </div>
  )
}

export default Header