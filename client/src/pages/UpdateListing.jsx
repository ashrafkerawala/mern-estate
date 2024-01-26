import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ListingForm from './ListingForm';

function UpdateListing() {
    const params = useParams()
    const [initialdata, setInitialData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const fetchListing = async () => {
            const listingId = params.listingId
            try {
                const res = await fetch(`/api/listing/get/${listingId}`, { signal })
                const data = await res.json();
                if(data.success === false) {
                    setIsLoading(false)
                    setError(data.message)
                } else {
                    setError(false)
                    setIsLoading(false)
                    setInitialData(data)
                }
            } catch (error) {
                setIsLoading(false)
                setError('Error While Fetching Data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchListing();

        return () =>  {
            controller.abort()
        }
    }, [params.listingId])

    return (
        <>
            { 
                isLoading ? (
                    'Loading Data...' // Display loading indicator
                ) : ( 
                    error ? (
                        <div>{error}</div>
                    ) : (
                        <ListingForm type="update" data={initialdata} />
                    )
                )
            }
        </>
    );
}

export default UpdateListing