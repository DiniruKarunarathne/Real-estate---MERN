import { useSelector } from "react-redux"
import { useRef, useState , useEffect} from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, SignOutUserStart, SignOutUserFailure, SignOutUserSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { set } from "mongoose";

export default function Profile() {

  const fileRef = useRef(null); // Added useRef hook to get access to file input element

  const {currentUser, loading, error } = useSelector(state => state.user);   // Extracting current user object from Redux store using useSelector
  

  const [file, setFile] = useState(undefined); // Added file state to store the file object

  const [filePerc , setFilePerc] = useState(0); // Added filePerc state to store the file upload percentage

  const [fileUploadError , setFileUploadError] = useState(false); // Added fileUploadError state to store the file upload error status

  const [formData, setFormData] = useState({}); // Added formData state to store the form data

  const [updateSuccess, setUpdateSuccess] = useState(false); // Added updateSuccess state to store the update success status

  const [showListingsError , setShowListingsError] = useState(false)

  const [userListings, setUserListings] = useState([]);  // Added userListings state to store the user listings

  const dispatch = useDispatch(); // Added useDispatch hook to dispatch actions

 
  
  //firebase storage rules
  { /* allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 && 
      request.resource.contentType.matches('image/.*') */}

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]) // Added useEffect hook to upload file to firebase storage when file state changes

  // Added handleFileUpload function to upload file to firebase storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app);                      
    const fileName = new Date().getTime() + file.name;     // Setting the file name to current timestamp + file name to avoid duplicate file names
    const storageRef = ref(storage, fileName);         // Creating a reference to the file in firebase storage
    const uploadTask = uploadBytesResumable(storageRef, file);       // Creating a upload task to upload the file to firebase storage
   
    uploadTask.on('state_changed',
      (snapshot) => { // Progress function 
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Progress percentage
        setFilePerc(Math.round(progress)); // Setting the percentage state
      },
      (error) => {
        setFileUploadError(true);
      },
      () => { // On complete function
        getDownloadURL(uploadTask.snapshot.ref)  // Getting the download url from firebase storage
          .then((downloadURL) => {    
            setFormData({ ...formData, avatar: downloadURL }); // Setting the avatar url in the formData state
            setFileUploadError(false); // Reset the error state on successful upload
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
            setFileUploadError(true); 
          });
      }
    );
  };
  
  // Added handleChange function to handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }); // Setting the form data state
  }

  // Added handleSubmit function to handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault(); // Preventing the default form submission behavior
    try {
      dispatch(updateUserStart()); // Dispatching the updateUserStart action
      const res = await fetch(`/backend/user/update/${currentUser._id}`, // Making a request to the backend to update the user
       {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Passing the form data to the backend
       });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message)); // Dispatching the updateUserFailure action on error
        return;
      } 

      dispatch(updateUserSuccess(data)); // Dispatching the updateUserSuccess action on success
      setUpdateSuccess(true); // Setting the update success state to true on success 
    } catch (error) {
      dispatch(updateUserFailure(error.message)); // Dispatching the updateUserFailure action on error
    }
  }
  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart()); // Dispatching the deleteUserStart action
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, // Making a request to the backend to delete the user
       {
        method: 'DELETE',
       });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message)); // Dispatching the deleteUserFailure action on error
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // Dispatching the deleteUserFailure action on error
    }
  }

  const handleSignOut = async() => {
    try {
      dispatch(SignOutUserStart());
      const res = await fetch('/backend/auth/signout')// Making a request to the backend to sign out the user
      const data = await res.json();    // Extracting the response data
      if(data.success === false){
        dispatch(SignOutUserFailure(data.message));
        return;
      }
      dispatch(SignOutUserSuccess(data));
    } catch (error) {
      dispatch(SignOutUserFailure(error.message));
    }
  }
  
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/backend/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/backend/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId)); // Updating the user listings state
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/> {/* Added file input element */}

        <img onClick={()=>fileRef.current.click()} src={formData?.avatar || currentUser.avatar} alt='profile'  className='rounded-full h-25 w-25 object-cover cursor-pointer self-center mt-2 border-2 border-slate-500' style={{ height: "150px", width: "150px", objectFit: "cover" }}/> 
        
        <p className="text-sm self-center"> {/* Added paragraph to show file upload status */} 

          {/* Added conditional rendering to show file upload status */}
          {fileUploadError ? (                                                                                // Check if there's an error during file upload
            <span className="text-red-700">Error uploading image (image must be less than 2mb)</span>       
          ) : filePerc > 0 && filePerc < 100 ? (                                                              // Check if file upload is in progress (percentage between 0 and 100)
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (                                                                            // Check if file upload is completed (percentage is 100)
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            '' // If none of the above conditions are met, render an empty string
          )}
        </p>

        <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="email" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading..' : 'Update'}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to = {"/create-listing"}>Create listing</Link>
      </form>

      <div className="flex justify-between mt-4 ">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error : ''}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'Update successful' : ''}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>

      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-contain'/>
              </Link>
              <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`} >
                    <button className='text-green-700 uppercase'>Edit</button>
                </Link>
                
              </div>
            </div>
          ))}
        </div>}

      
    </div>
  )
}
