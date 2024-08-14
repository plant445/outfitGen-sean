import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {Link } from 'react-router-dom'
import Header from '../components/Header'

const ShowClothes = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token', token);

        setLoading(true);
        axios
            .get('http://localhost:5555/items', { headers: { 'Authorization': `Bearer ${token}` } })
            .then((response) => {
                setItems(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
  return (
    <div >
        <div className='mb-14'><Header /></div>
        <h1 className='text-3xl my-8 text-center'>
            Collection
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {items.map((item, index) => (
                <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white" key={index}>
                    <Link to = {`/delete/${item.id}`}>
                    <img src={item.imageUrl} alt={item.type} className="h-auto rounded" />
                    </Link>
                    <p className="mt-2">{item.type}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ShowClothes
