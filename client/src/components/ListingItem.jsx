import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

function ListingItem({ listing }) {
  return (
    <div 
      className='bg-white shadow-md hover:shadow-lg transition-shadow 
        duration-300 overflow-hidden rounded-lg w-full sm:w-[300px] 2xl:w-[270px]'>
      <Link to={`/listing/${listing._id}`}>
        <img 
          src={listing.imageUrls[0]} 
          alt="Listing Cover"
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='flex-1 text-sm truncate text-gray-700'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <div className='flex items-center gap-1 text-slate-500 mt-2 font-semibold text-lg'>
            <p>${ listing.offer ? 
              listing.discountPrice.toLocaleString('en-US') : 
              listing.regularPrice.toLocaleString('en-US') }</p>
            <p>{ listing.type === 'rent' && '/ month' }</p>
          </div>
          <div className='text-slate-700 text-sm flex gap-4 font-bold'>
            <div>{ listing.bedrooms > 1 ? `${listing.bedrooms} beds`: `${listing.bedrooms} bed` }</div>
            <div>{ listing.bathrooms > 1 ? `${listing.bathrooms} baths`: `${listing.bathrooms} bath` }</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

ListingItem.propTypes = {
    listing: PropTypes.object
}

export default ListingItem
