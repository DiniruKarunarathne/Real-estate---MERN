import { useSelector } from "react-redux"
import { useRef, useState , useEffect} from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { set } from "mongoose";

export default function Profile() {

  const fileRef = useRef(null); // Added useRef hook to get access to file input element

  const {currentUser, loading, error } = useSelector(state => state.user);   // Extracting current user object from Redux store using useSelector
  

  const [file, setFile] = useState(undefined); // Added file state to store the file object

  const [filePerc , setFilePerc] = useState(0); // Added filePerc state to store the file upload percentage

  const [fileUploadError , setFileUploadError] = useState(false); // Added fileUploadError state to store the file upload error status

  const [formData, setFormData] = useState({}); // Added formData state to store the form data

  const [updateSuccess, setUpdateSuccess] = useState(false); // Added updateSuccess state to store the update success status

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

  
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
   
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
      const res = await fetch(`/backend/user/update/${currentUser._id}`, 
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
      setUpdateSuccess(true); // Setting the update success state
    } catch (error) {
      dispatch(updateUserFailure(error.message)); // Dispatching the updateUserFailure action on error
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
      </form>

      <div className="flex justify-between mt-4 ">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error : ''}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'Update successful' : ''}
      </p>
    </div>
  )
}
