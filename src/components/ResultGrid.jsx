import { useEffect } from "react";
import { fetchPhotos, fetchVideos, fetchRandomPhotos, fetchRandomVideos } from "../api/mediaApi";
import {setQuery, setLoading,setError,setResults,clearResults } from "../redux/features/searchSlice"
import { useDispatch, useSelector } from "react-redux"
import MasonryGrid from "./MasonryGrid";
const ResultGrid = () => {
const dispatch = useDispatch();
const {query,activeTab,results,loading,error} =
useSelector((store)=>store.search)


  const getData = async () => {
  try {
    dispatch(setLoading());

    let data = [];

    // 🟢 CASE 1: NO QUERY → RANDOM IMAGES
   if (!query || query.trim() === "") {

  // 🟢 PHOTOS TAB
  if (activeTab === "photos") {
    let response = await fetchRandomPhotos();

    data = response.map((item) => ({
      id: item.id,
      type: "photo",
      title: item.alt_description || "Random Image",
      thumbnail: item.urls.small,
      src: item.urls.full,
    }));
  }

  // 🔴 VIDEOS TAB
  if (activeTab === "videos") {
    let response = await fetchRandomVideos();

    data = response.videos.map((item) => ({
      id: item.id,
      type: "video",
      title: item.user.name || "Random Video",
      thumbnail: item.image,
      src: item.video_files[0].link,
    }));
  }
}

    // 🔍 CASE 2: SEARCH QUERY EXISTS
    else {
      if (activeTab === "photos") {
        let response = await fetchPhotos(query);

        data = response.results.map((item) => ({
          id: item.id,
          type: "photo",
          title: item.alt_description
            ? `${item.alt_description} - ${query}`
            : query,
          thumbnail: item.urls.small,
          src: item.urls.full,
          query: query,
        }));
      }

      if (activeTab === "videos") {
        let response = await fetchVideos(query);

        data = response.videos.map((item) => ({
          id: item.id,
          type: "video",
          title: item.user.name
            ? `${item.user.name} - ${query}`
            : query,
          thumbnail: item.image,
          src: item.video_files[0].link,
          query: query,
        }));
      }
    }

    dispatch(setResults(data));
    
    // Save current results to localStorage for ImageDetail component
    localStorage.setItem('currentResults', JSON.stringify(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

     useEffect(()=>{
        getData()
   },[query,activeTab])

 if(error) return <h1>Something went wrong !</h1>
 if(loading) return <h1>Loading...</h1>

  return (
    <div>
     {results.length > 0 && query.trim() !== "" && (
  <div className="flex justify-between items-center px-4 py-2 mb-4">
    <h2 className="text-white text-lg font-semibold">
      {results.length} results for "{query}"
    </h2>
    <button
      onClick={() => {
        dispatch(setQuery(""));
        dispatch(clearResults());
      }}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      Clear Results
    </button>
  </div>
)}
      
      <MasonryGrid results={results} />
    </div>
  )
}

export default ResultGrid;