import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const DeleteItem = () => {
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDeleteItem = () => {
        const token = localStorage.getItem('token');
        console.log('Token', token);

        setLoading(true);
        axios
            .delete(`http://localhost:5555/delete/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(() => {
                setLoading(false);
                navigate('/items');
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    if (loading) {
        return <div>Loading...</div>
    }
  return (
    <div className='p-4'>
        <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
            <h3 className='text-2xl'>Are You Sure You Want to Delete?</h3>
            <button
                className='p-4 bg-red-600 text-white m-8 w-full'
                onClick={handleDeleteItem}>
                    Yes, Delete It
            </button>
        </div>
    </div>
  )
}

export default DeleteItem
    