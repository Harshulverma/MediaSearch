import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTabs } from "../redux/features/searchSlice";

const Tabs = () => {
  const tabs = ["photos", "videos"];
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.search.activeTab);
  return (
    <div className="flex gap-10 p-10">
      {tabs.map((tab) => (
        <button
          className={`${(activeTab === tab) && "bg-blue-700"}   border-2 px-4 py-2 text-xl rounded outline-none`}
          key={tab}
          onClick={()=>{
            dispatch(setActiveTabs(tab))
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
