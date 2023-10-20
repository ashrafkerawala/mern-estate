import { Link } from "react-router-dom"

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-3">
        <input 
          className="border rounded-lg p-3"
          type="text" name="username" id="username" placeholder="Username" />
        <input 
          className="border rounded-lg p-3"
          type="email" name="email" id="email" placeholder="Email" />
        <input 
          className="border rounded-lg p-3"
          type="password" name="password" id="password" placeholder="Password" />
        <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-70 uppercase">Sign Up</button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Have an account?</p>
        <Link to="/sign-in" className="text-blue-700 hover:underline">Sign In</Link>
      </div>
    </div>
  )
}

export default SignUp