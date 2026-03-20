import React from 'react';
import ResultCard from './ResultCard';
import CollectionCard from './CollectionCard';

const MasonryGrid = ({ results, isCollection = false }) => {
  // Create a unique key by combining id and type to prevent duplicates
  const getUniqueKey = (item, index) => {
    return `${item.id}-${item.type}-${index}`;
  };

  return (
    <div className="p-4">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {results.map((item, index) => (
          <div
            key={getUniqueKey(item, index)}
            className="break-inside-avoid mb-4 transform transition-all duration-300 hover:scale-105 hover:z-10"
          >
            {isCollection ? (
              <CollectionCard item={item} />
            ) : (
              <ResultCard item={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;
