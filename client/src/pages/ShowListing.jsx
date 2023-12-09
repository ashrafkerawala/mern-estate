import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

ShowListings.propTypes = {
    listings: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        imageUrls: PropTypes.arrayOf(PropTypes.string)
    })),
    updateListings: PropTypes.func.isRequired
}

function ShowListings({ listings, updateListings }) {

    const handleDeleteListing = async (id) => {
        try {
            const res = await fetch(`/api/listing/delete/${id}`, { method: 'DELETE' })
            const data = await res.json();
            if(data.success === false) {
                console.log(data.message)
                return;
            }
            updateListings(id)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='flex flex-col gap-3 mb-2'>
            <h2 className='text-2xl text-center font-semibold'>Your Listings</h2>
            {
                listings.map((listing, index) => {
                    return (
                        <div key={listing.name + index}>
                            <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-solid border-slate-300 p-3 rounded-lg'>
                                <div className='flex flex-row justify-start gap-4 items-center flex-wrap sm:flex-nowrap'>
                                    <Link to={`listing/${listing._id}`}>
                                        <img className='w-24 h-16 object-cover rounded-lg' src={listing.imageUrls[0]} />
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
                                        onClick={() => handleDeleteListing(listing._id)}
                                        className='text-l uppercase text-red-700'
                                        type='button'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ShowListings;