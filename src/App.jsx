import React from 'react'
import SearchBar from './components/SearchBar'
import Tabs from './components/Tabs'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom"
import CollectionPage from './pages/CollectionPage'
import ImageDetail from './components/ImageDetail'
import VideoDetail from './components/VideoDetail'

const App = () => {
  return (
    <div className='min-h-screen text-white w-full bg-gray-950 flex flex-col'>
      <SearchBar />
      <Tabs />
      
      <main className='flex-grow'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/image/:id" element={<ImageDetail />} />
          <Route path="/video/:id" element={<VideoDetail />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App