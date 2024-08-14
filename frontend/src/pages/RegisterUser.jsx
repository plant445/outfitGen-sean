import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const RegisterUser = () => {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

  //Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5555/register', {
        name,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        // Navigate to the home page on successful login or registration
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during registration/login:', error);
      setErrorMessage(error.response?.data?.message || 'Username or Password does not meet min length');
      // alert(error.response?.data?.message || 'USERNAME/PASSWORD does not meet min length');
    }
  };
    

    return (
        <div>
            <div className='text-center bg-gray-200 w-full h-24 mb-24'>
                <p className='pl-10 pt-8 text-4xl font-custom '>OUTFIT GENERATOR</p>
            </div>
            <div className='text-3xl text-center font-custom'>Login or Register an Account</div>

            <form onSubmit={handleSubmit}>
                <div className='flex flex-col pl-48 ml-96 mb-3 mt-10'>
                    <div>
                        <div className='pb-3 '>
                            <label className='pr-5 text-2xl font-custom'>USERNAME:</label>
                            <input
                            type="text"
                            value = {name}
                            placeholder='At least 4 characters'
                            onChange={(e) => setName(e.target.value)}
                            className='border-2 border-black w-52 h-8 pl-1'
                            />
                        </div>
                        <div className='pb-3 '>
                            <label className='pr-16 text-2xl font-custom'>EMAIL:</label>
                            <input
                            type="text"
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='border-2 border-black w-52 h-8 pl-1'
                            />
                        </div>
                        <div className='pb-3'>
                            <label className='pr-5 text-2xl font-custom'>PASSWORD:</label>
                            <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            value = {password}
                            placeholder='At least 6 characters'
                            onChange={(e) => setPassword(e.target.value)}
                            className='border-2 border-black w-52 h-8 pl-1'
                            />
                            <button type="button" onClick={togglePasswordVisibility} className='ml-3 font-custom'>
                                {isPasswordVisible ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>
                </div>
                {errorMessage && <p className='text-red-600 text-center font-custom pb-3'>{errorMessage}</p>}

                <div className='text-center'>
                    <button type="submit" className='bg-black text-white w-96  h-7'>CONTINUE</button>
                </div>
                
            </form>


        </div>
    )
}

export default RegisterUser