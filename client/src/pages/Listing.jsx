import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Listing() {
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true)
            setError(false)
            const controller = new AbortController()
            const signal = controller.signal
            try {
                const res = await fetch(`/api/listing/get/${params.listingId}`, { signal })
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
            { listing && listing.name }
        </div>
    )
}
