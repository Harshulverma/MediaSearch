import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import MasonryGrid from "../components/MasonryGrid"

const CollectionPage = () => {

  const items = useSelector(
    (state) => state.collection.items
  )

  if (!items.length)
    return (
      <div className="text-center mt-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-4"
        >
          ← Back to Home
        </Link>
        <h1>No items saved</h1>
      </div>
    )

  return (
    <div>
      <div className="px-6 py-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
      
      {/* Masonry Grid Layout for Collection */}
      <MasonryGrid results={items} isCollection={true} />
    </div>
  )
}

export default CollectionPage