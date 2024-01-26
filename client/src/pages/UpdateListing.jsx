import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ListingForm from './ListingForm';

function UpdateListing() {
    const params = useParams()
    const [initialdata, setInitialData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const fetchListing = async () => {
            const listingId = params.listingId
            setLoading(true)
            try {
                const res = await fetch(`/api/listing/get/${listingId}`, { signal })
                const data = await res.json();
                if(data.success === false) {
                    setLoading(false)
                    setError(true)
                    return;
                }
                setError(false)
                setLoading(false)
                setInitialData(data)
            } catch (error) {
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchListing();
    }, [params.listingId])

    return (
        <>
            { loading && <p className='text-2xl text-center my-7 font-semibold'>Loading...</p> }
            { error && <p className='text-2xl text-center my-7 font-semibold'>Error while loading data</p> }
            { initialdata && initialdata !== null && !loading && !error && (
                <ListingForm type="update" data={initialdata} />
            )}
        </>
    );
}

export default UpdateListing