import React from 'react'
import SearchBar from './components/SearchBar'
import Tabs from './components/Tabs'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom"
import CollectionPage from './pages/CollectionPage'
const App = () => {
  return (
    <div className='min-h-screen text-white w-full bg-gray-950 '>
      <SearchBar />
      <Tabs />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </div>
  )
}

export default App