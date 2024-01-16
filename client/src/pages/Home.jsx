import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings)

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/backend/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error); 
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/backend/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error); 
      }
    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/backend/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error); 
      }
    }

    fetchOfferListings();


  }, []);
  return (
    <div>


      {/* top */}

      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next <span className="text-slate-500">perfect</span> 
        <br/> place with ease
        </h1>

        <div className="text-gray-400 text-xs sm:text-sm ">
          Realestate is a real estate listing platform that makes it easy , fast and comfortable to find your next home. Our expert support are always available
        </div>

        <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline ">Let's get started...</Link>
      </div>


      {/* swiper */}
      
      <Swiper autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        
        modules={[Autoplay, Pagination]}
        >
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
            <SwiperSlide>
              <div style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize: 'cover'}}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>



      <div className="bg-gray-200 p-10">
        <h2 className='text-3xl font-semibold text-slate-900 text-center'>What would you like to do?</h2>
        <p className='text-center mb-10'>Make property decisions smart and informed.</p>
        <div className='mt-20 flex justify-between space-x-10'>
          <div className='w-1/3 border p-4 flex flex-col items-center'>
            <h2 className='text-xl font-bold mb-4 text-slate-800 text-center '>Find a property for sale</h2>
            <p className='text-center'>Find an Apartment or Building for sale</p>
            <Link className='mt-auto  bg-blue-300 rounded-lg p-2' to={'/search?type=sale'} style={{marginTop: '20px'}}>Find sales</Link>
          </div>
          <div className='w-1/3 border p-4 flex flex-col items-center'>
            <h2 className='text-xl font-bold mb-4 text-slate-800 text-center '>Find a property for rent</h2>
            <p className='text-center'>Find a House, Apartment or Building for rent/lease</p>
            <Link className='mt-auto  bg-blue-300 rounded-lg p-2 'to={'/search?type=rent'}>Find rentals</Link>
          </div>
          <div className='w-1/3 border p-4 flex flex-col items-center'>
            <h2 className='text-xl font-bold mb-4 text-slate-800 text-center '>Create your advertisement</h2>
            <p className='text-center'>Create and post advertisements for your properties </p> 
            <Link className='mt-auto bg-blue-300 rounded-lg p-2'to={'/create-listing'}>Create ad</Link>
          </div> 
        </div> 
      </div> 





      {/* listing result */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            {/* <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div> */}
            <Swiper
              navigation
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                820: {
                  slidesPerView: 2, 
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 60,
                },
              }}
            >
              {offerListings && offerListings.length > 0 && offerListings.map((listing) => ( 
                <SwiperSlide key={listing._id}>
                  <div className="p-2">
                    <ListingItem listing={listing} />
                  </div>
                  
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      
        {rentListings && rentListings.length > 0 && (
          <div >
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            {/* <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div> */}
            <Swiper
              navigation
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                820: {
                  slidesPerView: 2, 
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 60,
                },
              }}
            >
              {rentListings && rentListings.length > 0 && rentListings.map((listing) => ( 
                <SwiperSlide key={listing._id}>
                  <div className="p-2">
                    <ListingItem listing={listing} />
                  </div>
                  
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            {/* <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div> */}
            <Swiper
              navigation
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                820: {
                  slidesPerView: 2, 
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 60,
                },
              }}
            >
              {saleListings && saleListings.length > 0 && saleListings.map((listing) => ( 
                <SwiperSlide key={listing._id}>
                  <div className="p-2">
                    <ListingItem listing={listing} />
                  </div>
                  
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  )
}
