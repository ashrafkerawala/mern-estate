import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa'

import 'swiper/css';
import 'swiper/css/navigation';

export default function Listing() {
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true)
            setError(false)
            try {
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if(data.success === false) {
                    setLoading(false)
                    setError(true)
                    return;
                }

                setLoading(false)
                setError(false)
                setListing(data)
            } catch (error) {
                setLoading(false)
                setError(true)
            }   
        }
        fetchListings()
    }, [params.listingId])

    return (
        <>
            { loading && <p className='text-2xl text-center my-7 font-semibold'>Loading...</p> }
            { error && <p className='text-2xl text-center my-7 font-semibold'>Error please try again</p> }
            { listing && !loading && !error && (
                    <>
                        <Swiper slidesPerView={1}  modules={[Navigation]} navigation>
                            {
                                listing.imageUrls.map(url => (
                                    <SwiperSlide  key={url}>
                                        <div
                                            className='h-[550px]'
                                            style={{
                                                background: `no-repeat center/cover url(${url})`
                                            }}
                                        >
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                        <div className='max-w-6xl mx-auto flex flex-col gap-4 my-7 px-6'>
                            <div className='flex gap-3 sm:flex-row flex-col'>
                                <p className='text-3xl font-semibold capitalize'>
                                    { listing.name }
                                </p>
                                <div className='flex items-baseline gap-2'>
                                    <p className={`text-3xl font-bold`}>
                                        ${ listing.discountPrice > 0 ? 
                                            listing.discountPrice : listing.regularPrice }
                                    </p>
                                    <p className={`text-m font-semibold uppercase ${listing.type === 'sell' ? 'text-red-700': ''}`}>
                                        { listing.type === 'rent' ? 'per month': '' }
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-2 capitalize'>
                                <div className='w-6'>
                                    <FaMapMarkerAlt className='sm:text-lg text-green-700 mt-2' />
                                </div>
                                <p className='text-sm sm:text-lg'>{ listing.address }</p>
                            </div>
                            <div className='flex items-center gap-4 text-lg text-white font-semibold capitalize'>
                                <div className='px-6 py-1 bg-red-700 rounded-md'>For { listing.type }</div>
                                <div className={`px-6 py-1 bg-green-700 rounded-md 
                                    ${listing.discountPrice > 0 ? '': 'hidden'}
                                `}>
                                    ${ +listing.regularPrice - +listing.discountPrice } discount
                                </div>
                            </div>
                            <p className='text-lg text-slate-700'>
                                <span className='text-black font-semibold'>Description: </span>
                                { listing.description }
                            </p>
                            <div className='flex flex-col gap-2 p-3 bg-gray-200 rounded-lg'>
                                <h3 className='text-lg font-semibold'>Amenities</h3>
                                <ul className='text-green-900 font-semibold text-sm capitalize flex flex-wrap items-center gap-4 sm:gap-6'>
                                    <li className='flex items-center gap-2 whitespace-nowrap'>
                                        <FaBed className='text-lg' />
                                        { listing.bedrooms + ' bedroom' }
                                    </li>
                                    <li className='flex items-center gap-2 whitespace-nowrap'>
                                        <FaBath className='text-lg' />
                                        { listing.bathrooms + ' bathroom' }
                                    </li>
                                    <li className='flex items-center gap-2 whitespace-nowrap'>
                                        <FaParking className='text-lg' />
                                        { listing.parking ? 'Parking Spot': 'No Parking' }
                                    </li>
                                    <li className='flex items-center gap-2 whitespace-nowrap'>
                                        <FaChair className='text-lg' />
                                        { listing.furnished ? 'furnished' : 'unfurnished' }
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}
