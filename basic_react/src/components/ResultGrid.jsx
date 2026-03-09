import { useEffect } from "react";
import { fetchPhotos,fetchVideos } from "../api/mediaApi"
import { setLoading,setError,setResults } from "../redux/features/searchSlice"
import { useDispatch, useSelector } from "react-redux"
import ResultCard from "./ResultCard";
const ResultGrid = () => {
const dispatch = useDispatch();
const {query,activeTab,results,loading,error} =
useSelector((store)=>store.search)


    const getData = async ()=>{
        try {
          if(!query) return;
          dispatch(setLoading())
         let data = []
        if(activeTab === "photos"){
          let response = await fetchPhotos(query)
          data = response.results.map((item)=>({
            id:item.id,
            type:'photo',
            title:item.alt_description,
            thumbnail:item.urls.small,
            src:item.urls.full
          }))
        }
        if(activeTab === "videos"){

            let response = await fetchVideos(query)
            data = response.videos.map((item)=>({
                id:item.id,
                type:'video',
                title:item.user.name || 'video',
                thumbnail:item.image,
                src:item.video_files[0].link
            }))
        }


       dispatch(setResults(data))
          
        } catch (error) {
          dispatch(setError(error.message))
        }
}


     useEffect(()=>{
        getData()
   },[query,activeTab])

 if(error) return <h1>Something went wrong !</h1>
 if(loading) return <h1>Loading...</h1>


  
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    {results.map((item) => (
      <ResultCard key={item.id} item={item} />
    ))}
  </div>
)
}

export default ResultGrid