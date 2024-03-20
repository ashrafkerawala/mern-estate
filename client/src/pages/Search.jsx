import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export const Search = () => {
    const navigate = useNavigate()
    const urlLocation = useLocation()

    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(urlLocation.search)
        const searTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        setSideBarData({
            searchTerm: searTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'createdAt',
            order: orderFromUrl || 'desc',
        })

        const fetchListings = async () => {
            setLoading(true)
            setShowMore(false)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            if(data.length > 8) {
                setShowMore(true)
            }
            setListings(data)
            setLoading(false)
        }

        fetchListings();

    }, [urlLocation.search])

    const handleChange = (e) => {
        if(
            e.target.id === 'all' || 
            e.target.id === 'rent' || 
            e.target.id === 'sell'
        ) {
            setSideBarData({ ...sideBarData, type: e.target.id })
        }

        if(e.target.id === 'searchTerm') setSideBarData({ ...sideBarData, searchTerm: e.target.value })

        if(
            e.target.id === 'offer' ||
            e.target.id === 'parking' ||
            e.target.id === 'furnished'
        ) {
            setSideBarData({ ...sideBarData, [e.target.id]: e.target.checked || false })
        }

        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt'
            const order = e.target.value.split('_')[1] || 'desc'
            setSideBarData({ ...sideBarData, sort, order })
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        for (const [key, value] of Object.entries(sideBarData)) {
            urlParams.set(key, value);
        }
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length
        const startIndex = numberOfListings
        const urlParams = new URLSearchParams(urlLocation.search)
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if(data.length < 9) {
            setShowMore(false)
        }
        setListings([...listings, ...data])
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-6 border-b md:border-r md:border-b-0 md:h-full'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex flex-row items-center gap-4'>
                        <label className='font-semibold whitespace-nowrap'>Search Term:</label>
                        <input
                            id='searchTerm' 
                            className='w-full p-3 py-2 border rounded-lg outline-slate-300' type="text" placeholder='Search...' value={sideBarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className='flex flex-wrap items-center gap-4'>
                        <label className='font-semibold whitespace-nowrap'>Type:</label>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="all"
                                className='w-5' onChange={handleChange} checked={sideBarData.type === 'all'} />
                            <label className='cursor-pointer' htmlFor="all">Rent & Sell</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="rent"
                                className='w-5' onChange={handleChange} checked={sideBarData.type === 'rent'} />
                            <label className='cursor-pointer' htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="sell"
                                className='w-5' onChange={handleChange} checked={sideBarData.type === 'sell'} />
                            <label className='cursor-pointer' htmlFor="sell">Sell</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="offer"
                                className='w-5' onChange={handleChange} checked={sideBarData.offer} />
                            <label className='cursor-pointer' htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-4'>
                        <label className='font-semibold whitespace-nowrap'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="furnished"
                                className='w-5' onChange={handleChange} checked={sideBarData.furnished} />
                            <label className='cursor-pointer' htmlFor="furnished">Furnished</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="parking"
                                className='w-5' onChange={handleChange} checked={sideBarData.parking} />
                            <label className='cursor-pointer' htmlFor="parking">Parking</label>
                        </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-4'>
                        <label className='font-semibold whitespace-nowrap'>Sort By:</label>
                        <select 
                            id="sort_order" 
                            onChange={handleChange}
                            value={`${sideBarData.sort}_${sideBarData.order}`} 
                            className='border rounded-lg p-3 outline-slate-300 cursor-pointer'
                        >
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className='text-white rounded-lg uppercase bg-slate-700 p-3 hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className='p-6 flex-1'>
                <h1 className='text-slate-700 font-semibold text-2xl md:text-3xl'>Listing Results:</h1>
                <div className="py-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No Listing found</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )}
                    {!loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing} /> )}
                    {showMore && (
                        <button 
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'>
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
