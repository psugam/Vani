import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-[80vh] bg-gray-100 flex items-center justify-center px-4'>
      <div className='max-w-4xl w-full bg-white rounded-lg shadow-md p-12 mt-12 mb-12'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>
            Sanskrit Digital Readers
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Access classical Sanskrit readers with integrated notes, annotations, and linked dictionary resources for enhanced learning
          </p>
        </div>

        {/* Readers Section */}
        <div className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
            Available Readers
          </h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <a 
              href='/lanman' 
              className='block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200'
            >
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Lanman's Sanskrit Reader
              </h3>
              <p className='text-gray-600 text-sm'>
                A comprehensive introduction to Sanskrit literature with vocabulary and grammatical notes
              </p>
            </a>

            <a 
              href='/macdonnell' 
              className='block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200'
            >
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Macdonnell's Sanskrit Reader
              </h3>
              <p className='text-gray-600 text-sm'>
                Classical texts with extensive annotations and linguistic commentary
              </p>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='text-center p-4'>
            <div className='text-3xl mb-2'>📖</div>
            <h4 className='font-semibold text-gray-800 mb-1'>Digital Texts</h4>
            <p className='text-sm text-gray-600'>
              Classic readers digitized for easy access
            </p>
          </div>

          <div className='text-center p-4'>
            <div className='text-3xl mb-2'>📝</div>
            <h4 className='font-semibold text-gray-800 mb-1'>Annotations</h4>
            <p className='text-sm text-gray-600'>
              Detailed notes and commentary included
            </p>
          </div>

          <div className='text-center p-4'>
            <div className='text-3xl mb-2'>🔗</div>
            <h4 className='font-semibold text-gray-800 mb-1'>
              <a href="/resources">Linked Resources</a>
              </h4>
            <p className='text-sm text-gray-600'>
              Integrated dictionary and reference tools
            </p>
          </div>
        </div>

    
        <div className='text-center p-4'>
            <div className='text-3xl mb-2'>📝</div>
            <h4 className='font-semibold text-gray-800 mb-1'>
              <a href="/transliterate">Transliterate tool</a>
              </h4>
            <p className='text-sm text-gray-600'>
              Transliterate text into a variety of scripts and schemes. 
            </p>
          </div>

        {/* CTA */}
        <div className='text-center'>
          <a 
            href='/lanman/toc' 
            className='inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
          >
            Browse Table of Contents
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home