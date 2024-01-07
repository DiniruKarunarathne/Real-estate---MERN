import React, { useState } from 'react';
import {Link , useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart , signInSuccess, signInFailure} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function Signin() {
  const [formData, setFormData] = useState({}); // Initialize state for form data
  const {loading, error} = useSelector((state) => state.user); // Get loading and error state from user slice (redux store)
  const navigate = useNavigate(); // Initialize navigate function from useNavigate hook
  const dispatch = useDispatch(); // Initialize dispatch function from useDispatch hook
  
  const handleChange = (e) => {
    setFormData({
      ...formData, // Spread existing data
      [e.target.id]: e.target.value, // Update value based on field ID
    });
  }
  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try{
          dispatch(signInStart()); // Dispatch sign in start action

          //Initiate a network request to the server for signup:
          const res = await fetch('/backend/auth/sign-In', {
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
            dispatch(signInFailure(data.message)); // Dispatch sign in failure action
            return;
          }
          dispatch(signInSuccess(data)); // Dispatch sign in success action
          navigate('/'); // Navigate to sign in page
  
        } catch(error){
          dispatch(signInFailure(error.message)); // Dispatch sign in failure action
        }
    
  };

 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type ='text' placeholder='email' className='border p-3 rounded-lg' id ='email'onChange={handleChange}/>
        <input type ='text' placeholder='password' className='border p-3 rounded-lg' id ='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ?'Loading..': 'Sign In' }{/*If loading is true, show 'Loading..', otherwise show 'Signup'*/} 
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>Dont have an account?</p>
        <Link to={"/signUp"}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}
