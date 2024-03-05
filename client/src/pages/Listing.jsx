import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';

export default function Listing() {
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    SwiperCore.use([Navigation])

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
        <div>
            { loading && <p className='text-2xl text-center my-7 font-semibold'>Loading...</p> }
            { error && <p className='text-2xl text-center my-7 font-semibold'>Error please try again</p> }
            { listing && !loading && !error && (
                    <Swiper slidesPerView={1} navigation>
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
                )
            }
        </div>
    )
}
