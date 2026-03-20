import React from 'react';

const Modal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110 group"
        >
          <svg className="w-6 h-6 text-white group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Media */}
          <div className="lg:w-2/3 bg-black flex items-center justify-center relative">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
            
            {item.type === "photo" ? (
              <img
                src={item.src}
                alt={item.title}
                className="max-w-full max-h-[70vh] object-contain z-10"
              />
            ) : (
              <video
                src={item.src}
                controls
                autoPlay
                className="max-w-full max-h-[70vh] object-contain z-10"
              />
            )}
          </div>

          {/* Info Panel */}
          <div className="lg:w-1/3 p-8 bg-gradient-to-b from-purple-900/50 to-slate-900/50 backdrop-blur-md">
            <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {item.title}
            </h2>
            
            <div className="space-y-6">
              {/* Type Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-2xl">
                  {item.type === "photo" ? "📸" : "🎥"}
                </span>
                <span className="text-white font-semibold capitalize">
                  {item.type}
                </span>
              </div>
              
              {/* Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  Details
                </h3>
                <div className="space-y-2 text-gray-200">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="font-medium capitalize">{item.type}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="font-medium font-mono text-sm">#{item.id}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Save to Collection
                  </button>
                  
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20">
                    Share
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-gray-200">
                    {item.type}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-gray-200">
                    media
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-gray-200">
                    search
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
