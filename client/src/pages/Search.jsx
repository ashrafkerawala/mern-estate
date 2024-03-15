
export const Search = () => {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-6 border-b md:border-r md:border-b-0 md:h-full'>
            <form className='flex flex-col gap-8'>
                <div className='flex flex-row items-center gap-4'>
                    <label className='font-semibold whitespace-nowrap'>Search Term:</label>
                    <input className='w-full p-3 py-2 border rounded-lg outline-slate-300' type="text" placeholder='Search...' />
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                    <label className='font-semibold whitespace-nowrap'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all"
                            className='w-5' />
                        <label className='cursor-pointer' htmlFor="all">Rent & Sell</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent"
                            className='w-5' />
                        <label className='cursor-pointer' htmlFor="rent">Rent</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sell"
                            className='w-5' />
                        <label className='cursor-pointer' htmlFor="sell">Sell</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer"
                            className='w-5' />
                        <label className='cursor-pointer' htmlFor="offer">Offer</label>
                    </div>
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                    <label className='font-semibold whitespace-nowrap'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished"
                            className='w-5' />
                        <label className='cursor-pointer' htmlFor="furnished">Furnished</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking"
                            className='w-5' />
                        <label className='cursor-pointer' htmlFor="parking">Parking</label>
                    </div>
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                    <label className='font-semibold whitespace-nowrap'>Amenities:</label>
                    <select id="sortOrder" className='border rounded-lg p-3 outline-slate-300 cursor-pointer'>
                        <option value="">Price high to low</option>
                        <option value="">Price low to high</option>
                        <option value="">Latest</option>
                        <option value="">Oldest</option>
                    </select>
                </div>
                <button className='text-white rounded-lg uppercase bg-slate-700 p-3 hover:opacity-95'>Search</button>
            </form>
        </div>
        <div className='p-6 flex-1'>
            <h1 className='text-slate-700 font-semibold text-2xl md:text-3xl'>Listing Results:</h1>
        </div>
    </div>
  )
}
