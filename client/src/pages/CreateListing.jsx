import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function CreateListing() {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({ 
        imageUrls: [],
        name: '', description: '', address: '',
        type: 'rent', bedrooms: 1, bathrooms: 1,
        furnished: false, parking: false, 
        regularPrice: 50, discountPrice: 0,
        offer: false
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You must upload atleast one image')
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price')
            setError(false)
            setLoading(true)
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })
            const data = await res.json();
            setLoading(false)
            if(data.success === false) {
                return setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error)
            setLoading(false)
        }
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

    const handleChange = (e) => {
        const { dataset: { type }, value, checked } = e.target;
        if(type === 'boolean') {
            setFormData({
                ...formData,
                [e.target.name]: checked
            })   
        } else if(type === 'number') {
            setFormData({
                ...formData,
                [e.target.name]: Number(value)
            })
        } else {
            setFormData({
                ...formData,
                [e.target.name]: value
            })
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-3 my-8">
            <h1 className='text-3xl font-semibold my-8 text-center'>Create Listing Page</h1>
            <form onSubmit={handleSubmit}
                className='flex flex-col md:flex-row gap-10'>
                <div className='flex flex-1 flex-col gap-5'>
                    <input
                        onChange={handleChange} 
                        value={formData.name}
                        data-type="string"
                        className='p-3 rounded-lg' type="text" name='name' placeholder='Name' maxLength='62' minLength='0' required />
                    <textarea 
                        onChange={handleChange}
                        value={formData.description}
                        data-type="string"
                        className='p-3 rounded-lg' name="description" cols="10" placeholder='Descripton' required></textarea>
                    <input 
                        onChange={handleChange}
                        value={formData.address}
                        data-type="string"
                        className='p-3 rounded-lg' type="text" name='address' placeholder='Address' required />
                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex flex-row'>
                            <input 
                                onChange={handleChange}
                                checked={formData.parking}
                                data-type="boolean"
                                className='w-4 cursor-pointer' type="checkbox" name="parking" id='parkingSpot' />
                            <label className='cursor-pointer pl-2' htmlFor="parkingSpot">Parking Spot</label>
                        </div>
                        <div className='flex flex-row'>
                            <input 
                                onChange={handleChange}
                                checked={formData.furnished}
                                data-type="boolean"
                                className='w-4 cursor-pointer' type="checkbox" name="furnished" id='furnished' />
                            <label className='cursor-pointer pl-2' htmlFor="furnished">Furnished</label>
                        </div>
                        <div className='flex flex-row'>
                            <input 
                                onChange={handleChange}
                                checked={formData.offer}
                                data-type="boolean"
                                className='w-4 cursor-pointer' type="checkbox" name="offer" id='offer' />
                            <label className='cursor-pointer pl-2' htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 flex-wrap'>
                        <h5 className='font-medium'>Listing Type: </h5>
                        <div className='flex flex-row'>
                            <input 
                                onChange={handleChange}
                                checked={ formData.type === 'rent' }
                                data-type="string"
                                className='w-4 cursor-pointer' type="radio" name="type" value='rent' id='rent' 
                            />
                            <label className='cursor-pointer pl-2' htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex flex-row'>
                            <input 
                                onChange={handleChange}
                                checked={ formData.type === 'sell' } 
                                data-type="string"
                                className='w-4 cursor-pointer' type="radio" name="type" value='sell' id='sell' 
                            />
                            <label className='cursor-pointer pl-2' htmlFor="sell">Sell</label>
                        </div>
                    </div>
                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex flex-row items-center'>
                            <input 
                                onChange={handleChange}
                                value={formData.bedrooms}
                                data-type="number"
                                className='p-1 px-3 rounded-lg w-16 h-10' type="number" name="bedrooms"  id='bedrooms' min='0' max='10' required />
                            <label className='pl-2' htmlFor="bedrooms">Bedrooms</label>
                        </div>
                        <div className='flex flex-row items-center'>
                            <input 
                                onChange={handleChange}
                                value={formData.bathrooms}
                                data-type="number"
                                className='p-1 px-3 rounded-lg w-16 h-10' type="number" name="bathrooms"  id='bathrooms' min='0' max='10' required />
                            <label className='pl-2' htmlFor="bathrooms">Bathrooms</label>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-center flex-wrap'>
                            <input 
                                onChange={handleChange}
                                value={formData.regularPrice}
                                data-type="number"
                                className='p-1 px-3 rounded-lg w-32 h-12' type="number" name="regularPrice"  id='regularPrice' min='50' max='1000000' required />
                            <div className='flex flex-col items-center'>
                                <label className='pl-2 flex-1' htmlFor="regularPrice">Regular Price</label>
                                <span className='text-xs'>{ formData.type == 'rent' ? '($/Month)' : '(in $)'}</span>
                            </div>
                        </div>
                        {
                            formData.offer && (
                                <div className='flex items-center flex-wrap'>
                                    <input 
                                        onChange={handleChange}
                                        value={formData.discountPrice}
                                        data-type="number"
                                        className='p-1 px-3 rounded-lg w-32 h-12' type="number" name="discountPrice"
                                        min='50' id='discountPrice' required />
                                    <div className='flex flex-col items-center'>
                                        <label className='pl-2 flex-1' htmlFor="discountPrice">Discounted Price</label>
                                        <span className='text-xs'>{ formData.type == 'rent' ? '($/Month)' : '(in $)'}</span>
                                    </div>
                                </div>
                            )
                        }
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
                    { imageUploadError && <p className='text-red-700 text-sm '>{ imageUploadError }</p> }
                    {
                        formData.imageUrls.length > 0  && 
                        <div className='flex gap-3 sm:flex-wrap items-end'>
                        { 
                            formData.imageUrls.map((url, index) => (
                                <div key={url} className='flex flex-col p-1 items-center'>
                                    <img src={url} alt='listing image' className='w-20 object-contain rounded-lg' />
                                    <button 
                                        type='button'
                                        onClick={() => handleRemoveimage(index)}
                                        className='p-1 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                                </div>
                            ))
                        }
                        </div>
                    }
                    <button 
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 hover:opacity-90 disabled:opacity-80 rounded-lg text-slate-50 w-full uppercase'>
                        { loading ? 'Creating...' : 'Create Listing' }
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </div>
    )
}

export default CreateListing