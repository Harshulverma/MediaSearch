import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTabs } from "../redux/features/searchSlice";

const Tabs = () => {
  const tabs = [
    { id: "photos", label: "📸 Photos", icon: "📸" },
    { id: "videos", label: "🎥 Videos", icon: "🎥" }
  ];
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.search.activeTab);
  
  return (
    <div className="flex justify-center gap-4 p-6 bg-gradient-to-b from-transparent to-purple-900/20 relative z-10">
      <div className="inline-flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setActiveTabs(tab.id))}
            className={`relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label.split(' ')[1]}</span>
            </span>
            
            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-sm"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
