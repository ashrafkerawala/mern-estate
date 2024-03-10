import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

Contact.propTypes = {
    listing: PropTypes.object
}

export default function Contact(props) {
    const { listing } = props
    const [landLord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()

                if(data.success === false) {
                    console.log(data.message)
                    return;
                }

                setLandLord(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchLandLord()
    }, [listing.userRef])

    return (
        <>
            { landLord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{ landLord.username }</span> for <span className='font-semibold'>{ listing.name.toLowerCase() }</span></p>
                    <textarea 
                        className='w-full border rounded-lg p-3'
                        onChange={(e) => setMessage(e.target.value)}
                        name="message" id="message" rows="2" value={message}
                        placeholder='Enter your message here...'
                    ></textarea>
                    <Link 
                        className='text-white bg-slate-700 hover:opacity-95 p-3 rounded-lg text-center'
                        to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}>
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}

