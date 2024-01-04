
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Functional component Contact that takes a 'listing' prop
export default function Contact({listing}) {
  const [landlord , setLandlord] = useState(null)
  const [message, setMessage] = useState('')

  // Event handler for message input changes
  const onChange = (e) =>{
    setMessage(e.target.value);
  };

  // Effect to fetch landlord information when listing.userRef changes
  useEffect(()=>{
    const fetchLandlord = async ()=> {
      try {
        const res = await fetch(`/backend/user/${listing.userRef}`)
        const data = await res.json()
        setLandlord(data);
      } catch (error) {
        console.log(error)
      }
    }
    // Triggering the fetchLandlord function when listing.userRef changes
    fetchLandlord();
  }, [listing.userRef])
  return (
    <div>
      {landlord && 
        <div className='flex flex-col gap-2 '>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea name='message' id='message' rows='2' value={message} onChange={onChange} placeholder='Enter your message here..' className='w-full border p-3 rounded-lg'></textarea>

          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-2 uppercase rounded-lg hover:opacity-95'>Sent message</Link>
        </div>
      }
    </div>
  )
}
