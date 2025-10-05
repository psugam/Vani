import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <div className='min-h-[10vh] bg-gray-100 flex justify-around items-center p-4 border-b border-black'>
      <div className='text-3xl font-bold'>
        
       <Link to="/" className='border border-black p-2'>Vāṇī </Link> 
      </div>
      <div className='border border-black p-2'>
        <ul className='flex space-x-8 text-lg'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/lanman/toc">Table of Contents</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

      </div>
    </div>
    </>
  )
}

export default Navbar