// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import MasonryGrid from "./MasonryGrid";
// import { addToCollection } from "../redux/features/collectionSlice";
// import { fetchVideos } from "../api/mediaApi";

// const VideoDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const collection = useSelector((state) => state.collection.items);

//   const [video, setVideo] = useState(null);
//   const [similarVideos, setSimilarVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [likes, setLikes] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [showComments, setShowComments] = useState(false);
//   const [isVideoHovered, setIsVideoHovered] = useState(false);

//   const isSaved = collection.some((item) => item.id === video?.id);

//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         setLoading(true);

//         const currentResults = JSON.parse(localStorage.getItem("currentResults") || "[]");
//         const foundVideo = currentResults.find((item) => item.id === id);

//         if (foundVideo) {
//           setVideo(foundVideo);

//           const storedLikes = localStorage.getItem(`likes_${id}`);
//           const storedComments = localStorage.getItem(`comments_${id}`);
//           const storedIsLiked = localStorage.getItem(`liked_${id}`);

//           setLikes(storedLikes ? parseInt(storedLikes) : 0);
//           setIsLiked(storedIsLiked === "true");
//           setComments(storedComments ? JSON.parse(storedComments) : []);

//           const searchQuery = foundVideo.query || "videos";
//           const similarData = await fetchVideos(searchQuery, 1, 20);

//           const items = similarData.videos || similarData.results || [];

//           const filtered = items
//             .filter((item) => item.id !== id)
//             .slice(0, 12)
//             .map((item) => ({
//               id: item.id,
//               type: "video",
//               title: item.description || item.title || "Similar Video",
//               thumbnail: item.image || item.thumbnail || item.src,
//               src: item.video_files?.[0]?.link || item.src || item.video,
//               query: searchQuery,
//             }));

//           setSimilarVideos(filtered);

//           const allVideos = [...currentResults, ...filtered];
//           localStorage.setItem("currentResults", JSON.stringify(allVideos));
          
//           // Also store the current video in localStorage for direct access
//           if (foundVideo) {
//             localStorage.setItem(`currentVideo_${id}`, JSON.stringify(foundVideo));
//           }
//         } else {
//           setError("Video not found");
//         }
//       } catch (err) {
//         setError("Failed to load video");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideoData();
//   }, [id]);

//   const saveHandler = () => {
//     if (!isSaved && video) {
//       dispatch(addToCollection(video));
//     }
//   };

//   const likeHandler = () => {
//     const newIsLiked = !isLiked;
//     const newLikes = newIsLiked ? likes + 1 : likes - 1;

//     setIsLiked(newIsLiked);
//     setLikes(newLikes);

//     localStorage.setItem(`likes_${id}`, newLikes.toString());
//     localStorage.setItem(`liked_${id}`, newIsLiked.toString());
//   };

//   const addComment = () => {
//     if (newComment.trim()) {
//       const comment = {
//         id: Date.now(),
//         text: newComment,
//         timestamp: new Date().toISOString(),
//         author: "User",
//       };

//       const updated = [comment, ...comments];
//       setComments(updated);
//       setNewComment("");

//       localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
//     }
//   };

//   const goBack = () => navigate(-1);

//   if (loading) return <div className="text-white p-10">Loading...</div>;
//   if (error || !video) return <div className="text-white p-10">{error}</div>;

//   return (
//     <div className="min-h-screen bg-slate-900 text-white">
//       {/* Header */}
//       <div className="p-4 flex justify-between">
//         <button onClick={goBack}>⬅ Back</button>
//         <button onClick={saveHandler}>{isSaved ? "Saved" : "Save"}</button>
//       </div>

//       <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 p-4">
//         {/* Video Section */}
//         <div className="lg:col-span-2 bg-white text-black rounded-xl overflow-hidden">
//           <video
//             src={video.src}
//             className="w-full"
//             controls
//           />

//           <div className="p-4">
//             <h1 className="text-2xl font-bold">{video.title}</h1>

//             <div className="flex gap-4 mt-4">
//               <button onClick={likeHandler}>
//                 ❤️ {likes}
//               </button>

//               <button onClick={() => setShowComments(!showComments)}>
//                 💬 {comments.length}
//               </button>
//             </div>

//             {showComments && (
//               <div className="mt-4">
//                 <input
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Add comment"
//                   className="border p-2 w-full"
//                 />
//                 <button onClick={addComment}>Post</button>

//                 {comments.map((c) => (
//                   <p key={c.id}>{c.text}</p>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ✅ FIXED SIDEBAR */}
//         <div className="lg:col-span-1">
//           <div className="bg-white/10 p-4 rounded-xl">
//             <h2>Video Details</h2>
//             <p>ID: {video.id}</p>
//             <p>Type: {video.type}</p>
//           </div>
//         </div>
//       </div>

//       {/* Similar Videos */}
//       {similarVideos.length > 0 && (
//         <div className="p-6">
//           <h2 className="text-xl mb-4">Similar Videos</h2>
//           <MasonryGrid results={similarVideos} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoDetail;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MasonryGrid from "./MasonryGrid";
import { addToCollection } from "../redux/features/collectionSlice";
import { fetchVideos } from "../api/mediaApi";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.collection.items);

  const [video, setVideo] = useState(null);
  const [similarVideos, setSimilarVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Interaction states
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const isSaved = collection.some((item) => item.id === video?.id);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to find video from multiple sources
        let foundVideo = null;
        
        // 1. Check specific video storage first
        const storedVideo = localStorage.getItem(`currentVideo_${id}`);
        if (storedVideo) {
          foundVideo = JSON.parse(storedVideo);
        }
        
        // 2. Check currentResults
        if (!foundVideo) {
          const currentResults = JSON.parse(localStorage.getItem("currentResults") || "[]");
          foundVideo = currentResults.find((item) => item.id === id);
        }

        if (!foundVideo) {
          setError("Video not found");
          return;
        }

        setVideo(foundVideo);
        setSearchQuery(foundVideo.query || "popular");

        // Load saved interactions
        const savedLikes = localStorage.getItem(`video_likes_${id}`);
        const savedComments = localStorage.getItem(`video_comments_${id}`);
        const savedLikedState = localStorage.getItem(`video_liked_${id}`);

        if (savedLikes) setLikes(parseInt(savedLikes));
        if (savedComments) setComments(JSON.parse(savedComments));
        if (savedLikedState) setIsLiked(savedLikedState === "true");

        // Fetch similar videos using the search query
        await loadSimilarVideos(foundVideo.query || foundVideo.title || "popular", foundVideo.id);

      } catch (err) {
        console.error("Error loading video:", err);
        setError("Failed to load video details");
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [id]);

  const loadSimilarVideos = async (query, currentVideoId) => {
    try {
      const data = await fetchVideos(query, 1, 20);
      
      // Format the videos for MasonryGrid
      const formatted = (data.videos || data.results || [])
        .filter(v => v.id.toString() !== currentVideoId.toString())
        .slice(0, 12)
        .map(v => ({
          id: v.id,
          type: "video",
          title: v.title || v.description || "Similar Video",
          thumbnail: v.image || v.thumbnail || v.src,
          src: v.video_files?.[0]?.link || v.src,
          duration: v.duration,
          user: v.user?.name || "Unknown",
          query: query
        }));

      setSimilarVideos(formatted);
      
      // Store similar videos in localStorage for quick access
      localStorage.setItem(`similar_videos_${currentVideoId}`, JSON.stringify(formatted));
      
    } catch (err) {
      console.error("Error loading similar videos:", err);
    }
  };

  const handleSave = () => {
    if (!isSaved && video) {
      dispatch(addToCollection(video));
    }
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    const newLikes = newLikedState ? likes + 1 : likes - 1;
    
    setIsLiked(newLikedState);
    setLikes(newLikes);
    
    localStorage.setItem(`video_liked_${id}`, newLikedState.toString());
    localStorage.setItem(`video_likes_${id}`, newLikes.toString());
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toISOString(),
      };
      
      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      setNewComment("");
      
      localStorage.setItem(`video_comments_${id}`, JSON.stringify(updatedComments));
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || "Video not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isSaved 
                ? "bg-emerald-600 text-white" 
                : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
          >
            {isSaved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Video Player Section - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden">
              <video
                key={video.src} // Force re-render when video changes
                src={video.src}
                controls
                autoPlay
                className="w-full aspect-video"
                poster={video.thumbnail}
              />
            </div>

            {/* Video Info */}
            <div className="mt-4 bg-slate-800 rounded-xl p-6">
              <h1 className="text-2xl font-bold mb-4">
                {video.title || "Untitled Video"}
              </h1>
              
              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked ? "bg-rose-600" : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <span>{isLiked ? "❤️" : "🤍"}</span>
                  <span>{likes}</span>
                </button>
                
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <span>💬</span>
                  <span>{comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-lg font-semibold mb-4">Comments</h3>
                  
                  {/* Add Comment */}
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-6 py-2 bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Post
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-sm text-slate-400 mb-1">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                        <p>{comment.text}</p>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-slate-400 text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Video Details */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Video ID</p>
                  <p className="font-mono text-sm">{video.id}</p>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm">Duration</p>
                  <p>
                    {video.duration 
                      ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`
                      : "Unknown"
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm">Uploaded by</p>
                  <p>{video.user || "Unknown"}</p>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm">Search Query</p>
                  <p className="text-rose-400">"{searchQuery}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Videos Section */}
        {similarVideos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Videos</h2>
            <p className="text-slate-400 mb-6">More videos related to "{searchQuery}"</p>
            
            {/* Use your existing MasonryGrid component */}
            <MasonryGrid 
              results={similarVideos} 
              onItemClick={(item) => handleVideoClick(item.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDetail;