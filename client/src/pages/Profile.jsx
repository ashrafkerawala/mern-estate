import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { stateStart, stateSuccess, stateFailure, stateReset } from '../redux/user/userSlice'

function Profile() {
  const { currentUser, loading, error, success } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [fileProgress, setFileProgress] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch()

  const handleUploadFile = useCallback(() => {
    setFileUploadErr(false)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
      }, (error) => {
        console.log(error)
        setFileUploadErr(true);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData(p => ({...p, avatar: downloadURL}))
        });
      }
    )
  }, [file])
  
  useEffect(() => {
    if(file) {
      handleUploadFile(file);
    }
  }, [file, handleUploadFile])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFileProgress(0)
    try {
      dispatch(stateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success === false) {
        dispatch(stateFailure(data.message))
        setTimeout(() => {
          dispatch(stateReset())
        }, 2000)
        return;
      }
      dispatch(stateSuccess(data))
      setTimeout(() => {
        dispatch(stateReset())
      }, 2000)
    } catch (error) {
      dispatch(stateFailure(error.message))
      setTimeout(() => {
        dispatch(stateReset())
      }, 2000)
    }
  }

  return (
    <div className='max-w-lg mx-auto px-3'>
      <h1 className='text-3xl font-semibold text-center my-8'>Profile</h1>
      <form
        onSubmit={handleSubmit} 
        className='flex justify-center flex-col items-center gap-5'>
        <input 
          disabled={loading}
          onChange={(e) => setFile(e.target.files[0])}
          className='hidden'
          type="file" name="avatar" ref={fileRef}
          accept='image/*' />
        <img 
          onClick={() => fileRef.current.click()}
          className='w-24 h-24 rounded-full object-cover cursor-pointer' 
          src={formData.avatar || currentUser.avatar} 
          alt="Avatar Main" />
        <p className='text-sm'>
          {
            fileUploadErr ? (
              <span className='text-red-700'>Error Uploading Image (Image must be less then 2mb)</span>
            ) : (fileProgress > 0 && fileProgress < 100) ? (
              <span className='text-slate-700'>Uploading {fileProgress}%...</span>
            ) : (fileProgress === 100) ? (
              <span className='text-green-700'>File Uploaded Succesfully</span>
            ) : ""
          }
        </p>
        <input 
          onChange={handleChange}
          className='w-full p-3 rounded-lg border-solid' 
          type="text" name="username"
          defaultValue={currentUser.username}
          placeholder='Username' />
        <input 
          onChange={handleChange}
          className='w-full p-3 rounded-lg border-solid' 
          type="text" name="email"
          placeholder='Email Address' 
          defaultValue={currentUser.email} />
        <input 
          onChange={handleChange}
          className='w-full p-3 rounded-lg border-solid' 
          type="password" name="password"
          placeholder='Password' />
        <button 
          disabled={loading}
          className='rounded-lg bg-slate-800 w-full p-3 text-white hover:opacity-95 disabled:opacity-80'>
          { loading ? 'Loading...': 'Update' }
        </button>
        <button 
          className='rounded-lg bg-green-700 w-full p-3 text-white hover:opacity-95 disabled:opacity-80'>
          Create Listing
        </button>
      </form>
      <div className='flex flex-row justify-between mt-4'>
        <span className='text-red-700 cursor-pointer hover:underline hover:underline-offset-2'>Delete account</span>
        <span className='text-red-700 cursor-pointer hover:underline hover:underline-offset-2'>Sign out</span>
      </div>
      <p className="text-red-600 mt-2">{ error ? error : '' }</p>
      <p className="text-green-700 mt-2">{ success ? 'Profile Updated Successfully' : '' }</p>
    </div>
  )
}

export default Profile