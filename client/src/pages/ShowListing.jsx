import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

ShowListings.propTypes = {
    listings: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        imageUrls: PropTypes.arrayOf(PropTypes.string)
    }))
}

function ShowListings({ listings }) {
    return (
        <div className='flex flex-col gap-3'>
            <h2 className='text-2xl text-center font-semibold'>Your Listings</h2>
            {
                listings.map((listing, index) => {
                    return (
                        <div key={listing.name + index}
                            className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-solid border-slate-300 p-3 rounded-lg'>
                            <div className='flex flex-row justify-start gap-4 items-center flex-wrap sm:flex-nowrap'>
                                <Link to={`listing/${listing._id}`}>
                                    <img className='w-36 object-contain rounded-lg' src={listing.imageUrls[0]} />
                                </Link>
                                <Link to={`listing/${listing._id}`}>
                                    <p className='text-slate-700 font-semibold text-l hover:underline'>{listing.name}</p>
                                </Link>
                            </div>
                            <div className='flex flex-row sm:flex-col gap-2'>
                                <button
                                    className='text-l uppercase' 
                                    type='button'>
                                    Edit
                                </button>
                                <button 
                                    className='text-l uppercase text-red-700'
                                    type='button'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ShowListings;