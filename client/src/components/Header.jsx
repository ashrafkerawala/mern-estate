import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">Real</span>
                        <span className="text-slate-700">Estate</span>
                    </h1>
                </Link>
                <form
                    className="bg-slate-100 p-2 px-3 rounded-lg flex items-center justify-between gap-2 w-24 sm:w-64">
                    <input type="text" placeholder="Search..."
                        className="bg-transparent focus:outline-none w-full" />
                    <FaSearch className="text-slate-600 cursor-pointer hidden sm:block" />
                </form>
                <ul className="flex gap-4 items-center">
                    <Link to="/">
                        <li className="hidden sm:inline text-slate-700 hover:underline hover:text-sky-700 cursor-pointer">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-slate-700 hover:underline hover:text-sky-700 cursor-pointer">
                            About
                        </li>
                    </Link>
                    <Link to="/profile">
                        {
                            currentUser ? (
                                <img 
                                    className='rounded-full h-8 w-8 object-cover border-solid border-2 border-slate-400'
                                    src={currentUser.avatar} 
                                    alt='profile' />
                            ) : (
                                <li className="hidden sm:inline text-slate-700 hover:underline hover:text-sky-700 cursor-pointer">
                                    Sign In
                                </li>
                            )
                        }
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header