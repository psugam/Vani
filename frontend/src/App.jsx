import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GetAllBooks from './api/GetAllBooks'
 import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChapterPage from './pages/ChapterPage'
import Home from './pages/Home';
import TableOfContents from './pages/TableOfContents';
import Resources from './pages/Resources'
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './pages/NotFound'

function App() {
  const [count, setCount] = useState(0);


  return (
    <>
      <BrowserRouter>
      <Navbar/>
<Routes>
  <Route path="lanman/chapter/:chapterNo" element={<ChapterPage />} />
  <Route path='/' element={<Home/>} />
  <Route path='/lanman/toc' element={<TableOfContents/>} />
  <Route path='/resources' element={<Resources/>} />
  <Route path='/about' element={<About/>} />
  <Route path='*' element ={<NotFound/>} />
</Routes>
<Footer/>
</BrowserRouter>
    
    {/* <GetAllBooks/> */}
    
    </>
  )
}

export default App
