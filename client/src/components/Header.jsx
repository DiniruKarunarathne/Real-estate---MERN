import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3' > {/* Added items-center */}
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex items-center'> {/* Added items-center */}
          <span className='text-slate-500'>Real</span>
          <span className='text-slate-700'>estate</span>
        </h1>
        </Link>
          <form className='ml-4 bg-slate-100 p-3 rounded-lg flex items-center'> {/* Added form with margin-left */}
            <input type="text" placeholder='Search..' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
            <FaSearch className='text-slate-500'/>
          </form>
          <ul className='flex gap-4'>
            <Link to='/'><li className='hidden sm:inline text-slate-500 hover:underline'>Home</li></Link>
            <Link to='/about'><li className='hidden sm:inline text-slate-500 hover:underline'>About</li></Link>
            <Link to='/sign-In'><li className=' sm:inline text-slate-500 hover:underline'>SignIn</li></Link> 
          </ul>
        
      </div>
    </header>
  );
}

