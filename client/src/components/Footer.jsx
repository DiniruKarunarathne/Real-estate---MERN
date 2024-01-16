import React from 'react'
import { FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <div className='mt-20 flex flex-col md:flex-row justify-between space-x-10 bg-slate-500 text-white p-10 '> 
    
        <div className='w-full md:w-1/2 ml-10 mb-10 md:mb-0'>
          <h1 className='text-2xl sm:text-2xl md:text-3x font-bold text-slate-100'>RealEstate</h1> 
          <br/>
          <p className='text-sm sm:text-base md:text-lg '>Realestate is a real estate listing platform that makes it easy ,</p>
          <p className='text-sm sm:text-base md:text-lg'> fast and comfortable to find your next home.</p>
         
        </div>

        <div className='w-full md:w-1/2 flex justify-end '>
          <div className='mr-28'>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-slate-100'>Contact Us:</h1>
            <br/>
            <p className='text-sm sm:text-base md:text-lg '>56, Melwin mawatha, Thalahena , Malabe</p>
            <p className='text-sm sm:text-base md:text-lg '>Kandy , SriLanka</p>
            <a href="tel:+94126456789" className="flex items-center ">
            <FaPhoneAlt className="mr-2"/>  +94 126 456 789
            </a>
          </div>
        </div>

      </div>
  
  )
}
