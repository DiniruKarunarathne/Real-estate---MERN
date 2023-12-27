import { useState } from 'react'
import {getStorage, uploadBytesResumable , ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase.js'
import { set } from 'mongoose'


export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError , setImageUploadError] = useState(false)
    const [uploading , setUploading] = useState(false)
    console.log(formData)

    const handleImageSubmit = (e) =>{
        if(files.length >0 && files.length + formData.imageUrls.length < 7){
            setUploading(true); 
            setImageUploadError(false); // Reset the error state to false before uploading
            const promises = []
            // This will loop through the files and push them to the promises array
            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i])) 
            }    
            // Wait for all promises to be resolved using Promise.all
            Promise.all(promises).then((urls) =>{
                // Once all promises are resolved, update the component state with the image URLs
               // Concatenate the new URLs with the existing ones in formData.imageUrls
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});

                setImageUploadError(false);
                setUploading(false);
            }).catch((err) =>{
                setImageUploadError('Image upload failed( 2mb max per image)');
                setUploading(false);
            })
        }else{
            setImageUploadError('You can upload up to 6 images');
            setUploading(false);
        }    
    }

    const storeImage = async(file) =>{
        return new Promise((resolve, reject) =>{
            const storage = getStorage(app)                                    // Initialize Firebase Storage with the app configuration        
            const fileName = new Date().getTime() + file.name;  
            const storageRef = ref(storage, fileName)                          // Create a reference to the specific location in Firebase Storage using the generated filename
            const uploadTask = uploadBytesResumable(storageRef, file)          // Initiate an upload task for the specified file to the specified storage reference 
            
            // Set up event listeners to monitor the upload task
            uploadTask.on(
                'state_changed',                                                                // Callback function for handling the 'state_changed' event
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error)=>{
                    reject(error);
                },
                // Event handler for when the upload is complete
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{            // Get the download URL of the uploaded file
                        resolve(downloadURL);                                                 // Resolve the Promise with the download URL
                    });
                }
                
            ) 
        })
    }

    const handleRemoveImage = (index) =>{
        setFormData({...formData,
             imageUrls: formData.imageUrls.filter((_, i) => i !== index)})
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7 '>Create a Listing</h1>

        <form className='flex flex-col sm:flex-row gap-4'>
            {/* Left side */}
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
                <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description'  required/>
                <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
                <div className='flex gap-6 flex-wrap '>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'/>
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='15' required className='p-3 border border-gray-300 rounded-lg'/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min='1' max='15' required className='p-3 border border-gray-300 rounded-lg'/>
                        <p>Baths</p>
                    </div><div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' min='1' max='15' required className='p-3 border border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div><div className='flex items-center gap-2'>
                        <input type='number' id='discountPrice' min='1' max='15' required className='p-3 border border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Discounted price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input onChange={(e) => setFiles(e.target.files)} // This will set the files to the state
                    type="file" 
                    className='border border-gray-300 p-3 rounded-lg w-full' 
                    id='images' 
                    accept='image/*' multiple required/>
                    <button onClick={handleImageSubmit} disabled={uploading} type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading.." : 'Upload'}</button>

                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url , index) =>(
                        <div key={url} className='flex justify-between p-3 border item-center'>
                            <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg'/>
                            <button onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg hover:opacity-75'>Delete</button>
                        </div>
                    ))
                }
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
            
        </form>
    </main>
  )
}
