import axios from 'axios'

const UNSPALASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY
const TENOR_KEY = import.meta.env.VITE_TENOR_KEY

 export async function fetchPhotos(query,page=1,per_page=30){
   const res  =  await axios.get('https://api.unsplash.com/search/photos',{
    params:{query,page,per_page},
    headers:{Authorization:`Client-ID ${UNSPALASH_KEY}`}
   })

   return res.data
}

export async function fetchVideos(query,page=1,per_page=40){
    const res  =await axios.get('https://api.pexels.com/v1/videos/search',{
    params:{query,page,per_page},
    headers:{Authorization:PEXELS_KEY}
   })
  return res.data
}

export async function fetchRandomPhotos(count =40) {
  const res = await axios.get(
    "https://api.unsplash.com/photos/random",
    {
      params: { count }, // 🔥 IMPORTANT
      headers: {
        Authorization: `Client-ID ${UNSPALASH_KEY}`,
      },
    }
  );

  return res.data; // return actual data
}

export async function fetchRandomVideos(page = 1, per_page = 20) {
  const res = await axios.get(
    "https://api.pexels.com/videos/popular",
    {
      params: { page, per_page },
      headers: {
        Authorization: PEXELS_KEY,
      },
    }
  );

  return res.data;
}