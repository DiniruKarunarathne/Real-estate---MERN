import { set } from 'mongoose';
import React, { useState } from 'react';
import {Link , useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({}); // Initialize state for form data
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(false); // Initialize loading state
  const navigate = useNavigate(); // Initialize navigate function from useNavigate hook
  
  const handleChange = (e) => {
    setFormData({
      ...formData, // Spread existing data
      [e.target.id]: e.target.value, // Update value based on field ID
    });
  }
  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try{
          setLoading(true); // Show a loading indicator while submitting

          //Initiate a network request to the server for signup:
          const res = await fetch('/backend/auth/signup', {
            method: 'POST',  //Specify that it's a POST request to create a new user:
            headers: {
              'Content-Type': 'application/json' //Indicate that the request body is in JSON format:
            },
            //Include the user's signup data in the request body:
            body: JSON.stringify(formData), // send body as JSON
          });
          const data = await res.json();
      
          // console.log(data);
          // Check if the request was successful:
          if (data.success === false) { 
            setLoading(false);
            setError(data.message); 
            return;
          }
          setLoading(false); // Hide loading indicator
          setError(null); // Clear any previous errors
          navigate('/sign-in'); // Navigate to sign in page
  
        } catch(error){
          setLoading(false);
          setError(error.message);
        }
    
  };

 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type ='text' placeholder='username' className='border p-3 rounded-lg' id ='username' onChange={handleChange}/>
        <input type ='text' placeholder='email' className='border p-3 rounded-lg' id ='email'onChange={handleChange}/>
        <input type ='text' placeholder='password' className='border p-3 rounded-lg' id ='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ?'Loading..': 'Signup' }{/*If loading is true, show 'Loading..', otherwise show 'Signup'*/} 
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>Already have an account?</p>
        <Link to={"/sign-In"}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}
