import React from 'react'
import { GoogleAuthProvider , getAuth , signInWithPopup} from '@firebase/auth'; // Import Google auth provider from Firebase auth library 
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch(); // Initialize dispatch function from useDispatch hook
    const navigate = useNavigate(); // Initialize navigate function from useNavigate hook
    // Add a function to handle Google sign in:
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider(); // Create a new Google auth provider
            const auth = getAuth(app); // Get auth service from Firebase
            const result = await signInWithPopup(auth , provider); // Sign in with popup using Google auth provider

            const res = await fetch('/backend/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName , email: result.user.email , photo:result.user.photoURL})
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log('could not sign in with google' , error)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button> // Add a button to sign in with Google
  )
} 
