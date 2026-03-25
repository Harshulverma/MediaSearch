import React, { useRef, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addToCollection } from "../redux/features/collectionSlice"

const ResultCard = memo(function ResultCard({ item }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const collection = useSelector((state) => state.collection.items);
  const query = useSelector((state) => state.search.query);
  const videoRef = useRef(null);

  // check if already saved
  const isSaved = collection.some((i) => i.id === item.id);

  // navigate to detail page based on type
  const openDetails = (e) => {
    // Prevent navigation if clicking on save button
    if (e?.target?.tagName === 'BUTTON' || e?.target?.closest('button')) {
      return;
    }
    
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Store the item in localStorage before navigating
    if (item.type === "video") {
      // Store video with proper key
      localStorage.setItem(`currentVideo_${item.id}`, JSON.stringify(item));
      
      // Also add to video-specific storage
      const videoResults = JSON.parse(localStorage.getItem('videoResults') || '[]');
      const exists = videoResults.some(v => v.id === item.id);
      if (!exists) {
        videoResults.push(item);
        localStorage.setItem('videoResults', JSON.stringify(videoResults));
      }
      
      // Navigate to video route
      navigate(`/video/${item.id}`);
    } else {
      // Navigate to image route
      navigate(`/image/${item.id}`);
    }
  };

  // Function to highlight search query in text
  const highlightText = (text, query) => {
    if (!text || !query) return text || "Untitled";

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 text-black font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const handleCardMouseEnter = () => {
    if (item.type !== "video" || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  };

  const handleCardMouseLeave = () => {
    if (item.type !== "video" || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      onClick={openDetails}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
    >
      
      {/* Media Container */}
      <div className="relative">
        
        {/* Media - Removed Links since we handle navigation with onClick */}
        {item.type === "photo" ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        )}

        {/* Overlay with Save Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
          <div className="w-full space-y-3">
            
            {/* Save Button */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  if (!isSaved) {
                    dispatch(addToCollection(item));
                  }
                }}
                disabled={isSaved}
                className={`w-fit px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm
                  ${isSaved 
                    ? "bg-emerald-500/90 text-white" 
                    : "bg-rose-500/90 text-white"
                  }
                `}
              >
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>

            {/* Type Badge */}
            <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-gray-800">
              {item.type === "photo" ? "📸 Photo" : "🎥 Video"}
            </span>
          </div>
        </div>

        {/* Top Right Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-2">
          
          {/* Eye Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              openDetails(e);
            }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            👁
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              // Add share functionality here if needed
              navigator.clipboard?.writeText(window.location.origin + 
                (item.type === "video" ? `/video/${item.id}` : `/image/${item.id}`));
            }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            🔗
          </button>
        </div>

      </div>
    </div>
  );
});

export default ResultCard;