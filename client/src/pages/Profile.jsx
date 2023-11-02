import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [fileProgress, setFileProgress] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if(file) {
      handleUploadFile(file);
    }
  }, [file])

  const handleUploadFile = (file) => {
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
          setFormData({...formData, avatar: downloadURL})
        });
      }
    )
  }

  return (
    <div className='max-w-lg mx-auto px-3'>
      <h1 className='text-3xl font-semibold text-center my-8'>Profile</h1>
      <form className='flex justify-center flex-col items-center gap-5'>
        <input 
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
          className='w-full p-3 rounded-lg border-solid' 
          type="text" name="username"
          defaultValue={currentUser.username}
          placeholder='Username' />
        <input 
          className='w-full p-3 rounded-lg border-solid' 
          type="text" name="email"
          placeholder='Email Address' 
          defaultValue={currentUser.email} />
        <input 
          className='w-full p-3 rounded-lg border-solid' 
          type="password" name="password"
          placeholder='Password' />
        <button 
          className='rounded-lg bg-slate-800 w-full p-3 text-white hover:opacity-95 disabled:opacity-80'>
          Update
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
    </div>
  )
}

export default Profile