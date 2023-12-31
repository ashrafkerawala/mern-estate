import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { stateStart, stateSuccess, stateFailure, stateSoftReset } from "../redux/user/userSlice"
import OAuth from "../components/OAuth"

function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(stateStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(stateFailure(data.message));
        return;
      }
      dispatch(stateSuccess(data));
      dispatch(stateSoftReset())
      navigate('/')
    } catch (error) {
      dispatch(stateFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          className="border rounded-lg p-3"
          type="email" name="email" id="email" placeholder="Email" onChange={handleChange} required />
        <input 
          className="border rounded-lg p-3"
          type="password" name="password" id="password" placeholder="Password" onChange={handleChange} required />
        <button disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-70 uppercase">
          { loading ? 'Loading...': 'Sign In' }
        </button>
        <OAuth />
      </form>
      { error && <p className="text-red-600 mt-2">{error}</p> }
      <div className="flex gap-2 mt-2">
        <p>Don&apos;t have an account?</p>
        <Link to="/sign-up" className="text-blue-700 hover:underline">Sign Up</Link>
      </div>
    </div>
  )
}

export default SignIn