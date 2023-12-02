import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { app } from '../firebase';

function CreateListing() {
    const [offerChecked, setOfferChecked] = useState(false)
    const [listingType, setListingType] = useState('rent')
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({ imageUrls: [] })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)

    const discountClass = offerChecked ? '' : 'hidden';
    const errorClass = imageUploadError ? '': 'hidden';

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitted')
    }

    const handleOfferChange = (e) => {
        setOfferChecked(e.target.checked)
    }

    const handleListingTypeChange = (e) => {
        setListingType(e.target.value)
    }

    const handleImageSubmit = () => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
            for(let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises)
                .then((urls) => {
                    setUploading(false)
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                    setImageUploadError(false)
                })
                .catch(() => {
                    setUploading(false)
                    setImageUploadError('Image Upload Failed (2mb max per image)')
                })
        } else {
            setImageUploadError('You can only upload 6 images per listing')
        }
    }

    const handleRemoveimage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index)
        })
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    return (
        <div className="max-w-5xl mx-auto px-3">
            <h1 className='text-3xl font-semibold my-8 text-center'>Create Listing Page</h1>
            <form onSubmit={handleSubmit}
                className='flex flex-col md:flex-row gap-10'>
                <div className='flex flex-1 flex-col gap-5'>
                    <input className='p-3 rounded-lg' type="text" name='name' placeholder='Name' maxLength='62' minLength='0' required />
                    <textarea className='p-3 rounded-lg' name="description" cols="10" placeholder='Descripton' required></textarea>
                    <input className='p-3 rounded-lg' type="text" name='address' placeholder='Address' required />
                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex flex-row'>
                            <input className='w-4 cursor-pointer' type="checkbox" name="parking" id='parkingSpot' />
                            <label className='cursor-pointer pl-2' htmlFor="parkingSpot">Parking Spot</label>
                        </div>
                        <div className='flex flex-row'>
                            <input className='w-4 cursor-pointer' type="checkbox" name="furnished" id='furnished' />
                            <label className='cursor-pointer pl-2' htmlFor="furnished">Furnished</label>
                        </div>
                        <div className='flex flex-row'>
                            <input 
                                className='w-4 cursor-pointer' type="checkbox" name="offer" id='offer' defaultChecked={false}
                                onChange={handleOfferChange} />
                            <label className='cursor-pointer pl-2' htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 flex-wrap'>
                        <h5 className='font-medium'>Listing Type: </h5>
                        <div className='flex flex-row'>
                            <input 
                                className='w-4 cursor-pointer' type="radio" name="type" value='rent' id='rent' 
                                defaultChecked={ listingType === 'rent' } 
                                onClick={handleListingTypeChange} />
                            <label className='cursor-pointer pl-2' htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex flex-row'>
                            <input 
                                className='w-4 cursor-pointer' type="radio" name="type" value='sell' id='sell' 
                                defaultChecked={ listingType === 'sell' } onClick={handleListingTypeChange} />
                            <label className='cursor-pointer pl-2' htmlFor="sell">Sell</label>
                        </div>
                    </div>
                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex flex-row items-center'>
                            <input className='p-1 px-3 rounded-lg w-16 h-10' type="number" name="bedrooms"  id='bedrooms' defaultValue='0' min='0' max='10' required />
                            <label className='pl-2' htmlFor="bedrooms">Bedrooms</label>
                        </div>
                        <div className='flex flex-row items-center'>
                            <input className='p-1 px-3 rounded-lg w-16 h-10' type="number" name="bathrooms"  id='bathrooms' defaultValue='0' min='0' max='10' required />
                            <label className='pl-2' htmlFor="bathrooms">Bathrooms</label>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-center flex-wrap'>
                            <input className='p-1 px-3 rounded-lg flex-1 h-12' type="number" name="regularPrice"  id='regularPrice' defaultValue='0' min='0' required />
                            <div className='flex flex-col items-center'>
                                <label className='pl-2 flex-1' htmlFor="regularPrice">Regular Price</label>
                                <span className='text-xs'>($/Month)</span>
                            </div>
                        </div>
                        <div className={'flex items-center flex-wrap ' + discountClass}>
                            <input className='p-1 px-3 rounded-lg flex-1 h-12' type="number" name="discountPrice"  id='discountPrice' required />
                            <div className='flex flex-col items-center'>
                                <label className='pl-2 flex-1' htmlFor="discountPrice">Discounted Price</label>
                                <span className='text-xs'>($/Month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-5'>
                    <p className='font-semibold'>Images: <span className='font-normal'>The First image will be the cover (max 6)</span></p>
                    <div className='flex items-center gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" name="images" id="images" accept='image/*' multiple />
                        <button
                            onClick={handleImageSubmit} 
                            type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' disabled={uploading}>{uploading ? "Uploading...": "Upload"}</button>
                    </div>
                    <p className={'text-red-700 text-sm ' + errorClass}>{ imageUploadError }</p>
                    {
                        formData.imageUrls.length > 0  && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center'>
                                <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                                <button 
                                    type='button'
                                    onClick={() => handleRemoveimage(index)}
                                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }
                    <button className='p-3 bg-slate-700 hover:opacity-90 disabled:opacity-80 rounded-lg text-slate-50 w-full uppercase'>Create Listing</button>
                </div>
            </form>
        </div>
    )
}

export default CreateListing