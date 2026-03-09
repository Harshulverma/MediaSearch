import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { setQuery } from "../redux/features/searchSlice";
import { Link } from "react-router-dom";
import { clearResults } from "../redux/features/searchSlice"
const SearchBar = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const inputRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(stored);
  }, []);

  const fetchSuggestions = debounce(async (query) => {
    if (!query) return;

    try {
      const res = await fetch(`https://api.datamuse.com/sug?s=${query}`);
      const data = await res.json();
      setSuggestions(data.map((item) => item.word));
    } catch (err) {
      console.error(err);
    }
  }, 500);

  useEffect(() => {
    if (text) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  }, [text]);

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

    dispatch(setQuery(value));

    const updatedRecent = [value, ...recent.filter((r) => r !== value)].slice(
      0,
      5
    );

    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
    setRecent(updatedRecent);

    setText("");
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
    <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white relative">

      {/* Logo */}
     <Link to="/" className="text-2xl font-bold">MediaSearch</Link>

      {/* Search Box */}
      <div className="w-full max-w-xl relative">

        <input
          ref={inputRef}
          type="text"
          value={text}
          placeholder="Search photos or videos..."
          onChange={(e) => {
            setText(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 rounded-lg text-black outline-none"
        />

        {showDropdown && (suggestions.length > 0 || recent.length > 0) && (
          <div
            ref={dropdownRef}
            className="absolute w-full bg-white text-black mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >

            {text === "" && recent.length > 0 && (
              <>
                <div className="flex justify-between px-4 py-2 text-sm text-gray-500">
                  <span>Recent Searches</span>

                  <button
                    onClick={clearHistory}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>

                {recent.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <span
                      onClick={() => submitSearch(item)}
                      className="cursor-pointer"
                    >
                      🕒 {item}
                    </span>

                    <button
                      onClick={() => deleteHistoryItem(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
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
                  className={`px-4 py-2 cursor-pointer ${
                    index === activeIndex
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item}
                </div>
              ))}

          </div>
        )}
      </div>

      {/* My Collection Button */}
      <Link
        to="/collection"
        className="ml-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
      >
        My Collection
      </Link>

    </div>
  );
};

export default SearchBar;