import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { removeFromCollection } from "../redux/features/collectionSlice"

const CollectionCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  // navigate to detail page based on type
  const openDetails = (e) => {
    // Prevent navigation if clicking on remove button
    if (e?.target?.tagName === 'BUTTON' || e?.target?.closest('button')) {
      return;
    }
    
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate to appropriate route
    if (item.type === "video") {
      navigate(`/video/${item.id}`);
    } else {
      navigate(`/image/${item.id}`);
    }
  };

  return (
    <div
      onClick={openDetails}
      className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
    >
      
      {/* Media Container */}
      <div className="relative">
        
        {/* Media */}
        {item.type === "photo" ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        ) : (
          <video
            src={item.src}
            muted
            loop
            className="w-full object-cover transition-all duration-500 group-hover:scale-110"
            onMouseEnter={() => setIsVideoHovered(true)}
            onMouseLeave={() => setIsVideoHovered(false)}
            autoPlay={isVideoHovered}
          />
        )}

        {/* Overlay with Remove Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
          <div className="w-full space-y-3">
            
            {/* Remove Button */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  dispatch(removeFromCollection(item.id));
                }}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-red-500/90 text-white hover:bg-red-600"
              >
                Remove
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
};

export default CollectionCard;
