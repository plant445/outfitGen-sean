import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SliderComponent from './SliderComponent'
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header'

const Home = () => {
    const [ pants, setPants] = useState([]);
    const [ shirts, setShirts] = useState([]);
    const [ jackets, setJackets] = useState([]);
    const [ loading, setLoading] = useState(false);
    const [ showShirts, setShowShirts] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {

      //if experimenting remove authorization header from every axios call and this following text
        const token = localStorage.getItem('token');
        console.log('Token', token);

        if (!token) {
          console.log("sending");
          navigate('/register');
          return;
        }
      //end of remove if text

        setLoading(true);
        Promise.all([
          axios.get('http://localhost:5555/items/type/shirt', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:5555/items/type/pant', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:5555/items/type/jacket', { headers: { 'Authorization': `Bearer ${token}` } })
        ])
          .then(([shirtsResponse, pantsResponse, jacketsResponse]) => {
            setShirts(shirtsResponse.data);
            setPants(pantsResponse.data);
            setJackets(jacketsResponse.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            if (error.response && error.response.status === 401) {
              // Token is invalid or expired
              localStorage.removeItem('token'); // Optionally clear the token
              navigate('/register'); // Redirect to login
            }
          });
      }, []);

    const handleCheckboxChange = () => {
        setShowShirts(!showShirts);
      };

    if (loading) {
    return <div>Loading...</div>;
    }
    
  return (
    <div >
        <div className='mb-14'><Header /></div>
        <div>
            <SliderComponent items={showShirts ? shirts : jackets} />
            <SliderComponent items={pants} />
      </div>
        <div className='flex justify-between items-center'>
        <label>
          <input
            type="checkbox"
            checked={showShirts}
            onChange={handleCheckboxChange}
          />
          Swap Shirts and Jackets
        </label>
        <button onClick={() => navigate('/create')}>Add New Clothing Item</button>
      </div>
    </div>
  )
}

export default Home
