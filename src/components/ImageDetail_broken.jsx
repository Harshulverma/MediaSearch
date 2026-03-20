import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MasonryGrid from "./MasonryGrid";
import { addToCollection } from "../redux/features/collectionSlice";
import { fetchPhotos } from "../api/mediaApi";

const ImageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.collection.items);
  const [image, setImage] = useState(null);
  const [similarImages, setSimilarImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Like and comment states
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Check if image is saved
  const isSaved = collection.some((item) => item.id === image?.id);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        setLoading(true);
        
        // Get current search results from Redux store
        const currentResults = JSON.parse(localStorage.getItem('currentResults') || '[]');
        const foundImage = currentResults.find(item => item.id === id);
        
        if (foundImage) {
          setImage(foundImage);
          
          // Load likes and comments from localStorage
          const storedLikes = localStorage.getItem(`likes_${id}`);
          const storedComments = localStorage.getItem(`comments_${id}`);
          const storedIsLiked = localStorage.getItem(`liked_${id}`);
          
          setLikes(storedLikes ? parseInt(storedLikes) : 0);
          setIsLiked(storedIsLiked === 'true');
          setComments(storedComments ? JSON.parse(storedComments) : []);
          
          // Fetch similar images based on the search query or type
          const searchQuery = foundImage.query || (foundImage.type === 'photo' ? 'nature' : 'videos');
          const similarData = await fetchPhotos(searchQuery, 1, 20);
          
          // Check if similarData has photos array, handle different response structures
          const photos = similarData.photos || similarData.results || [];
          
          // Filter out the current image and limit to 12 similar images
          const filtered = photos
            .filter(photo => photo.id !== id)
            .slice(0, 12)
            .map(photo => ({
              id: photo.id,
              type: 'photo',
              title: photo.alt_description || photo.title || 'Similar Image',
              thumbnail: photo.urls?.small || photo.thumbnail || photo.src,
              src: photo.urls?.full || photo.src || photo.image,
              query: searchQuery
            }));
          
          setSimilarImages(filtered);
        } else {
          // If not found in current results, try to fetch it directly
          // For now, show error - in production you might fetch by ID
          setError("Image not found");
        }
      } catch (err) {
        setError("Failed to load image");
        console.error("Error fetching image data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [id]);

  const saveHandler = () => {
    if (!isSaved && image) {
      dispatch(addToCollection(image));
    }
  };

  const likeHandler = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    
    // Save to localStorage
    localStorage.setItem(`likes_${id}`, newLikes.toString());
    localStorage.setItem(`liked_${id}`, newIsLiked.toString());
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
        author: "User" // In production, this would be the logged-in user
      };
      
      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      setNewComment("");
      
      // Save to localStorage
      localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || "Image not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              MediaSearch
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={saveHandler}
              disabled={isSaved}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm
                ${isSaved 
                  ? "bg-emerald-500/90 hover:bg-emerald-600/90 text-white shadow-lg" 
                  : "bg-rose-500/90 hover:bg-rose-600/90 text-white shadow-lg"
                }
              `}
            >
              {isSaved ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Image Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-black">
                {image.type === "photo" ? (
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={image.src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              {/* Image Info */}
              <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      className={isLiked ? "text-red-500" : "text-gray-800"}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span className="text-gray-800 font-semibold text-lg">
                    {likes} {likes === 1 ? 'Like' : 'Likes'}
                  </span>
                </div>
                
                {/* Comments Button - Instagram Style */}
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-gray-800 hover:text-purple-600 transition-colors duration-300 transform hover:scale-105"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-semibold text-lg">
                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                  </span>
                </button>
              </div>
              
              {/* Comments Section */}
              {showComments && (
                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Comments</h3>
                  
                  {/* Add Comment */}
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addComment()}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 rounded-xl outline-none border border-white/20 focus:border-purple-400 focus:bg-white/30 transition-all duration-300"
                    />
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Post
                    </button>
                  </div>
                  
                  {/* Comments List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {comments.length === 0 ? (
                      <p className="text-gray-300 text-center py-8">No comments yet. Be the first to comment!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-white">{comment.author}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-200">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
              <h2 className="text-xl font-bold text-white mb-4">Details</h2>
              
              <div className="space-y-4 text-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-medium capitalize">{image.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="font-medium font-mono text-sm">#{image.id}</span>
                </div>
                {image.query && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Search:</span>
                    <span className="font-medium">{image.query}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-gray-200">
                    {image.type}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-gray-200">
                    media
                  </span>
                  {image.query && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-gray-200">
                      {image.query}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Images Section */}
        {similarImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Similar Images
            </h2>
            <MasonryGrid results={similarImages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDetail;
