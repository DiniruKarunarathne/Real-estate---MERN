import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState(''); // Added searchTerm state
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);           // Create a new URLSearchParams object with the current URL's query parameters.
    urlParams.set('searchTerm', searchTerm);                                 // Set the 'searchTerm' parameter in the URL to the current value of the searchTerm state.
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);           // Create a new URLSearchParams object with the current URL's query parameters.
    const searchTermFromUrl = urlParams.get('searchTerm');                   // Get the value of the 'searchTerm' parameter from the URL.
    
    if (searchTermFromUrl) {                                                 // If the 'searchTerm' parameter exists in the URL, set the searchTerm state to its value.
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3' > {/* Added items-center */}
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex items-center'> {/* Added items-center */}
          <span className='text-slate-500'>Real</span>
          <span className='text-slate-700'>estate</span>
        </h1>
        </Link>
          <form onSubmit={handleSubmit} className='ml-4 bg-slate-100 p-3 rounded-lg flex items-center'> {/* Added form with margin-left */}
            <input type="text" placeholder='Search..' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
            <button><FaSearch className='text-slate-500'/></button>
          </form>
          <ul className='flex gap-4'>
            <Link to='/'><li className='hidden sm:inline text-slate-500 hover:underline'>Home</li></Link>
            <Link to='/about'><li className='hidden sm:inline text-slate-500 hover:underline'>About</li></Link>
            <Link to='/profile'>
              {currentUser ? (
                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>
              ) : (
                <li className=' text-slate-500 hover:underline'>SignIn</li> 
              )}
            </Link> 
          </ul>
        
      </div>
    </header>
  );
}

