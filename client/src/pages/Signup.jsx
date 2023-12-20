import {Link} from 'react-router-dom'

export default function Signup() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form className='flex flex-col gap-4'>
        <input type ='text' placeholder='username' className='border p-3 rounded-lg' id ='username'/>
        <input type ='text' placeholder='email' className='border p-3 rounded-lg' id ='email'/>
        <input type ='text' placeholder='password' className='border p-3 rounded-lg' id ='password'/>
        <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>Already have an account?</p>
        <Link to={"/sign-In"}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
