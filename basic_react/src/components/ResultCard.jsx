import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToCollection } from "../redux/features/collectionSlice"

const ResultCard = ({ item }) => {

  const dispatch = useDispatch()

  const collection = useSelector((state) => state.collection.items)

  // check if already saved
  const isSaved = collection.some((i) => i.id === item.id)

  const saveHandler = () => {
    if (!isSaved) {
      dispatch(addToCollection(item))
    }
  }

  return (

    <div className="bg-white shadow rounded overflow-hidden">

      {/* MEDIA */}

      {item.type === "photo" ? (

        <img
          src={item.thumbnail}
          className="w-full h-48 object-cover"
        />

      ) : (

        <video
          src={item.src}
          muted
          autoPlay
          loop
          className="w-full h-48 object-cover"
        />

      )}

      {/* CONTENT */}

      <div className="p-3">

        <p className="text-sm mb-2 text-black">
          {item.title || "Untitled"}
        </p>

        <button
          onClick={saveHandler}
          disabled={isSaved}
          className={`px-3 py-1 rounded text-sm text-white
            ${isSaved ? "bg-green-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {isSaved ? "Saved ✓" : "Save"}
        </button>

      </div>

    </div>
  )
}

export default ResultCard