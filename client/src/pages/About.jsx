import React from 'react'

export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800 text-center'>About Realestate</h1> 
      <span className='text-center block mb-10'>Realestate is a trusted and reliable platform that connects buyers and sellers of properties across Sri Lanka. Whether you are looking for a cozy apartment, a spacious villa, a commercial space, or a land plot, you will find it on Realestate.</span>
      
      <div className='mt-20 flex justify-between space-x-10'> 
        <div className='w-1/2'>
          <h2 className='text-xl font-bold mb-4 text-slate-800 '>Why choose Realestate?</h2>
          <ul>
            <li><strong>Variety:</strong> Offers a wide range of properties in different locations, sizes, and prices.</li>
            <li><strong>Convenience:</strong> Easy search, compare, and contact sellers with advanced filters, maps, and direct chat.</li>
            <li><strong>Security:</strong> Verifies identity and ownership of sellers ensuring accurate listings.</li>
            <li><strong>Support:</strong> Friendly customer service ready to assist via phone, email or chat.</li>
          </ul>
        </div>

        <div className='w-1/2'>
          <h2 className='text-xl font-bold mb-4 text-slate-800 '>How to use Realestate?</h2>
          <ul>
            <li><strong>Selling:</strong> Create an account to post ads with options for upgrade for more exposure.</li>
            <li><strong>Buying:</strong> Browse listings using filters and maps; contact sellers directly for details or viewings.</li>
          </ul>

          Join us today at Realestate for all your property needs in Sri Lanka! 
        </div>

      </div>

    </div>
    )
}
 
