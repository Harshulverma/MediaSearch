import { useSelector, useDispatch } from "react-redux"
import { removeFromCollection } from "../redux/features/collectionSlice"

const CollectionPage = () => {

  const dispatch = useDispatch()

  const items = useSelector(
    (state) => state.collection.items
  )

  if (!items.length)
    return <h1 className="text-center mt-10">No items saved</h1>

  return (

    <div className="grid grid-cols-4 gap-4 p-6">

      {items.map((item) => (

        <div key={item.id} className="bg-white shadow rounded">

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

          <div className="p-3 flex justify-between">

            <span>{item.title}</span>

            <button
              onClick={() =>
                dispatch(removeFromCollection(item.id))
              }
              className="text-red-500"
            >
              Remove
            </button>

          </div>

        </div>

      ))}

    </div>

  )
}

export default CollectionPage