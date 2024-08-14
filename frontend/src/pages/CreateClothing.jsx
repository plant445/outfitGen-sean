import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import he from '../images/he.png'

const CreateClothing = () => {
    const [type, setType] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);


    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('type', type);
      formData.append('image', image);
      
      const token = localStorage.getItem('token');
      console.log('Token', token);

  
      try {
        
        await axios.post('http://localhost:5555/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate('/');
      } catch (error) {
        console.error('Error uploading clothing item:', error.response ? error.response.data : error.message);
      }
    };

    const handleOptionChange = (e) => {
      setType(e.target.value);
    };

    const handleRemoveImage = () => {
      setSelectedFile(null);
      setSelectedName(null);
      setPreviewURL(null);
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(previewURL);
    };


    return (
      <div>
        <div className='mb-12'><Header/></div>
        <h1 className='text-4xl font-custom text-center mb-4'>Create Clothing Item</h1>


        <form onSubmit={handleSubmit}>
          {/* Image Uploader */}
          <div className="flex items-center">
            <div className="w-96 m-auto p-8 bg-white rounded-xl border-2 border-black">
              <div className="text-center pl-3 pr-3 relative cursor-pointer hover:opacity-70 opacity-100">
                {previewURL ? (
                  <img src={previewURL} alt="preview" className="max-w-full max-h-60 m-auto" />
                ) : (
                  <img src={he} alt="upload" />
                )}
                <h3 className='mb-5 mt-1 font-custom'>{selectedName || "Click box to upload"}</h3>
                <input
                  type="file"
                  className="block h-full w-full absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    setPreviewURL(URL.createObjectURL(file));
                    setSelectedName(file.name)
                  }}
                  required
                />
              </div>
              <div className='flex justify-center pb-5 pt-3'>
                <button
                  onClick={handleRemoveImage}
                  className="absolute bg-red-500 text-white w-60 rounded-lg h-7 ml-15 opacity-70 hover:opacity-100 pt-1 font-custom"
                >
                  Delete Uploaded Image
                </button>
              </div>

            </div>
          </div>


          {/* Dropdown Menu */}
          <div className='text-xl mt-16 text-center font-custom'>
            <label className='pr-2'>Type:</label>
            <select id="dropdown" value={type} onChange={handleOptionChange} className='border-black border-2' required>
              <option value="">Select an option</option>
              <option value="shirt">SHIRT</option>
              <option value="jacket">JACKET</option>
              <option value="pant">PANT</option>
              <option value="shoe">SHOE</option>
            </select>
          </div>
          <div className='text-center mt-10 mb-12'>
            <button type="submit" className='text-xl bg-gray-600 rounded-lg text-white w-96  h-9 font-custom hover:bg-black'>Add Item</button>
          </div>
          
        </form>
      </div>
    );
  };


  export default CreateClothing;