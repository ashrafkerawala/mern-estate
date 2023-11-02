import { useSelector } from 'react-redux/es/hooks/useSelector'

function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='max-w-lg mx-auto px-3'>
      <h1 className='text-3xl font-semibold text-center my-8'>Profile</h1>
      <form className='flex justify-center flex-col items-center gap-5'>
        <img 
          className='w-24 h-24 rounded-full object-cover cursor-pointer' 
          src={currentUser.avatar} 
          alt="Avatar Main" />
        <input 
          className='w-full p-3 rounded-lg border-solid' 
          type="text" name="username"
          value={currentUser.username} 
          placeholder='Username' />
        <input 
          className='w-full p-3 rounded-lg border-solid' 
          type="text" name="email"
          placeholder='Email Address' 
          value={currentUser.email} />
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