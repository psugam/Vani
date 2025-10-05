import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='min-h-[80vh] bg-gray-100 flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full bg-gray-100 rounded-lg shadow-md p-12 text-center'>
        {/* 404 Number */}
        <div className='mb-6'>
          <h1 className='text-9xl font-bold text-gray-800'>404</h1>
        </div>

        {/* Error Message */}
        <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
          Page Not Found
        </h2>
        <p className='text-lg text-gray-600 mb-8'>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link 
            to='/' 
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
          >
            Go to Home
          </Link>
          <Link 
            to='/lanman/toc' 
            className='px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium'
          >
            View Table of Contents
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound