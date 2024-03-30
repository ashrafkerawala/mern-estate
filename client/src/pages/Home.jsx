import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import ListingItem from '../components/ListingItem';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const [offerListings, setOfferListings] = useState([])
    const [saleListings, setSaleListings] = useState([])
    const [rentListings, setRentListings] = useState([])


    useEffect(() => {
      const fetchOfferListings = async () => {
        try {
          const res = await fetch('/api/listing/get?offer=true&limit=4')
          const data = await res.json();
          setOfferListings(data)
          fetchRentListings()
        } catch (error) {
          console.log(error)
        }
      }

      const fetchRentListings = async () => {
        try {
          const res = await fetch('/api/listing/get?type=rent&limit=4')
          const data = await res.json();
          setRentListings(data)
          fetchSaleListings()
        } catch (error) {
          console.log(error)
        }
      }

      const fetchSaleListings = async () => {
        try {
          const res = await fetch('/api/listing/get?type=sell&limit=4')
          const data = await res.json();
          setSaleListings(data)
        } catch (error) {
          console.log(error)
        }
      }

      fetchOfferListings();
    }, [])

    return (
        <div>
            {/* Top */}
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                  <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                    Find your next <span className='text-slate-500'>perfect</span>
                    <br /> 
                    place with ease
                  </h1>
                <div className='text-gray-400 text-xs sm:text-sm'>
                  Real Estate is the best place to find your next perfect place to live.
                  <br />
                  We have a wide range of properties for you to choose from.
                </div>
                <Link
                  className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' 
                  to={'/search'}>
                  Let&apos;s Get Started...
                </Link>
            </div>

            {/* Slider */}
            {
              offerListings && offerListings.length > 0 && (
                <Swiper 
                  slidesPerView={1} 
                  modules={[Navigation]} navigation>
                    {
                      offerListings[2].imageUrls.map(url => (
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[500px]'
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

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
              
              {
                offerListings && offerListings.length > 0 && (
                  <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-baseline my-3'>
                      <h2 className='text-slate-600 text-2xl font-semibold'>
                        Recent Offers
                      </h2>
                      <Link 
                        to={'/search?offer=true'}
                        className='group/link text-sm text-blue-800 flex items-center gap-2 font-semibold'
                      >
                        Show more <FaArrowRight className='group-hover/link:translate-x-1 transition-all duration-300' />
                      </Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {
                        offerListings.map((listing) => (
                          <ListingItem key={listing._id} listing={listing} />
                        ))
                      }
                    </div>
                  </div>
                )
              }
              {
                rentListings && rentListings.length > 0 && (
                  <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-baseline my-3'>
                      <h2 className='text-slate-600 text-2xl font-semibold'>
                        Recent places for rent
                      </h2>
                      <Link 
                        to={'/search?type=rent'}
                        className='group/link text-sm text-blue-800 flex items-center gap-2 font-semibold'
                      >
                        Show more <FaArrowRight className='group-hover/link:translate-x-1 transition-all duration-300' />
                      </Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {
                        rentListings.map((listing) => (
                          <ListingItem key={listing._id} listing={listing} />
                        ))
                      }
                    </div>
                  </div>
                )
              }
              {
                saleListings && saleListings.length > 0 && (
                  <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-baseline my-3'>
                      <h2 className='text-slate-600 text-2xl font-semibold'>
                        Recent places for sale
                      </h2>
                      <Link 
                        to={'/search?type=sell'}
                        className='group/link text-sm text-blue-800 flex items-center gap-2 font-semibold'
                      >
                        Show more <FaArrowRight className='group-hover/link:translate-x-1 transition-all duration-300' />
                      </Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {
                        saleListings.map((listing) => (
                          <ListingItem key={listing._id} listing={listing} />
                        ))
                      }
                    </div>
                  </div>
                )
              }
            </div>

        </div>
    )
}

export default Home