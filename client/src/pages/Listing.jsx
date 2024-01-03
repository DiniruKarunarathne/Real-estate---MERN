import { set } from "mongoose"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams()                         // Get the listingId parameter from the URL
    const [listing, setListing] = useState(null)       // State to hold the listing data
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    // Fetch listing data from the backend when the component mounts
    useEffect(() =>{   
        const fetchListing = async() =>{
              try {
                  setLoading(true)
                  const res = await fetch(`/backend/listing/get/${params.listingId}`);        // Fetch listing data from the backend using the listingId parameter
                  const data = await res.json();                                              // Parse the JSON response
                  
                  // Check if the backend response indicates an error
                  if(data.success === false){
                    setError(true)
                    setLoading(false)
                    return;
                  }
                  setListing(data);          // Update the state with the retrieved listing data
                  setLoading(false)
                  setError(false)
              } catch (error) {
                  setError(true)
              }
        }
        fetchListing()
    }, [params.listingId])// Dependency array ensures the effect runs when 'listingId' changes


    console.log(loading)
  return (
    <div>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}                   
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {listing && !loading && !error && (      // Render the listing data if available and there are no loading or error states 
        <div>
          <Swiper navigation>
            
            {/* Map through the image URLs and create a SwiperSlide for each image */}
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}
