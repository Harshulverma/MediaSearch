import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../redux/features/searchSlice";
import { Link } from "react-router-dom";
import { fetchPhotos } from "../api/mediaApi";

const SearchBar = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query); // ✅ GET QUERY FROM REDUX

  const inputRef = useRef();
  const dropdownRef = useRef();

  // ✅ SYNC REDUX → INPUT (MAIN FIX)
  useEffect(() => {
    setText(query);
  }, [query]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(stored);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) return;

    try {
      const photosResponse = await fetchPhotos(query, 1, 5);

      const photoKeywords = photosResponse.results
        .map(photo => photo.alt_description || photo.description || '')
        .filter(desc => desc)
        .map(desc => desc.toLowerCase().split(' '))
        .flat()
        .filter(word => word.length > 3 && word.includes(query.toLowerCase()));

      const suggestions = [
        ...new Set([
          query,
          ...photoKeywords.slice(0, 3)
        ])
      ];

      setSuggestions(suggestions);
    } catch (err) {
      console.error('Error fetching suggestions:', err);

      const variations = [
        query,
        `${query} hd`,
        `${query} wallpaper`,
        `${query} background`
      ];
      setSuggestions(variations);
    }
  }, []);

  useEffect(() => {
    if (text) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  }, [text, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const submitSearch = (value) => {
    if (!value.trim()) return;

    dispatch(setQuery(value)); // ✅ ONLY REDUX CONTROLS SEARCH

    const updatedRecent = [value, ...recent.filter((r) => r !== value)].slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
    setRecent(updatedRecent);

    setSuggestions([]);
    setActiveIndex(-1);
    setShowDropdown(false);
  };

  const deleteHistoryItem = (item) => {
    const updated = recent.filter((r) => r !== item);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setRecent([]);
    localStorage.removeItem("recentSearches");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        submitSearch(suggestions[activeIndex]);
      } else {
        submitSearch(text);
      }
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative backdrop-blur-xl z-20">
      
      {/* ✅ Logo resets query (IMPORTANT FIX) */}
      <Link
        to="/"
        onClick={() => dispatch(setQuery(""))}
        className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105"
      >
        MediaSearch
      </Link>

      {/* Search Box */}
      <div className="w-full max-w-2xl relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            placeholder="Search for amazing photos and videos..."
            onChange={(e) => {
              setText(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-gray-300 outline-none border border-white/20 focus:border-purple-400 focus:bg-white/20 transition-all duration-300 shadow-xl"
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {showDropdown && (suggestions.length > 0 || recent.length > 0) && (
          <div
            ref={dropdownRef}
            className="absolute w-full bg-white/95 backdrop-blur-xl text-black mt-2 rounded-2xl shadow-2xl z-[100] max-h-80 overflow-y-auto border border-white/20"
          >

            {text === "" && recent.length > 0 && (
              <>
                <div className="flex justify-between px-6 py-4 text-sm text-gray-600 border-b border-gray-200">
                  <span className="font-semibold">Recent Searches</span>

                  <button
                    onClick={clearHistory}
                    className="text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {recent.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-6 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 cursor-pointer group"
                  >
                    <span
                      onClick={() => submitSearch(item)}
                      className="flex items-center gap-3 text-gray-800 group-hover:text-purple-600"
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </span>

                    <button
                      onClick={() => deleteHistoryItem(item)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}

            {text !== "" &&
              suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => submitSearch(item)}
                  className={`px-6 py-4 cursor-pointer transition-all duration-200 ${
                    index === activeIndex
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
                      : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {item}
                  </div>
                </div>
              ))}

          </div>
        )}
      </div>

      <Link
        to="/collection"
        className="ml-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        My Collection
      </Link>

    </div>
  );
};

export default SearchBar;