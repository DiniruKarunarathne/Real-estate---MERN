import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function () {
    const navigate = useNavigate();
    // Initialize state with default values for sidebar filters
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
      });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    console.log(listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);   // It creates a new URLSearchParams object using the location.search property. This property contains the query string of the URL.
        const searchTermFromUrl = urlParams.get('searchTerm');    // searchParams.get() method to get the value of the searchTerm parameter from the URL.
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        // It checks if any of the parameters are present in the URL. If they are, it updates the state using the setSidebardata function.
        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
          ) {
            setSidebardata({
              searchTerm: searchTermFromUrl || '',
              type: typeFromUrl || 'all',
              parking: parkingFromUrl === 'true' ? true : false,
              furnished: furnishedFromUrl === 'true' ? true : false,
              offer: offerFromUrl === 'true' ? true : false,
              sort: sortFromUrl || 'created_at',
              order: orderFromUrl || 'desc',
            });
          }
          // creates a function called fetchListings() that will fetch the listings from the API using the URLSearchParams object.
          const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/backend/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
              }
            setListings(data);
            setLoading(false);
          };
      
          fetchListings();
    }, [location.search]);

    // Function to handle changes in the form inputs
    const handleChange = (e) => { 

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {              // This condition checks if the event was triggered by a checkbox with the IDs 'all', 'rent', or 'sale'.
            setSidebardata({...sidebardata, type: e.target.id})                            //it updates the state sidebardata using the setSidebardata function. It creates a new object with the same properties as sidebardata but sets the 'type' property to the ID of the checkbox that triggered the change.
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({...sidebardata, [e.target.id]:e.target.checked || e.target.checked === 'true' ? true : false})
        }

        // This condition checks if the event was triggered by the select element with the ID 'sort_order'.
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0]  || 'created_at';       // It creates a new variable called sort and sets it to the value of the select element. It then splits the value by the underscore character and sets the sort variable to the first element of the resulting array. If the value of the select element doesn't contain an underscore, it sets the sort variable to 'created_at'.
            const order = e.target.value.split('_')[1] || 'desc';             

            setSidebardata({...sidebardata , sort, order})    // It updates the state by creating a new object with the same properties as sidebardata, but setting the 'sort' property to the value of the sort variable and the 'order' property to the value of the order variable.
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };

      const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        
        urlParams.set('startIndex', startIndex);

        const searchQuery = urlParams.toString();
        const res = await fetch(`/backend/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      };

    
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-semibold' >Search Term:</label>
                    <input type="text" id="searchTerm" placeholder='Search...' className='border rounded-lg p-3 w-full' value={sidebardata.searchTerm} onChange={handleChange}/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all" className='w-5' onChange={handleChange} checked={sidebardata.type === 'all'}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={sidebardata.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={sidebardata.type === 'sale'}/>
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={sidebardata.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={sidebardata.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={sidebardata.furnished}/>
                        <span>Furnished</span>
                    </div>
                    
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select
                        onChange={handleChange}
                        defaultValue={'created_at_desc'}
                        id='sort_order'
                        className='border rounded-lg p-3'>
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to hight</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95'>Search</button>
            </form>
        </div>

        <div className="flex-1">
            <h1 className='text-3xl font-semibold p-3 border-b text-slate-700 mt-5'>Listing results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && 
                <p className='text-center text-xl text-slate-700 '>
                    No listings found.
                </p>
                }
                {loading && (
                <p className='text-center text-xl text-slate-700 w-full'>
                    Loading...
                </p>
                )}
                { !loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing}/>)}
                { showMore && <button className='text-green-700 uppercase hover:underline p-7 text-center w-full' onClick={() => onShowMoreClick()}>Show more</button>}
            </div>
        </div>
    </div>
  )
}
