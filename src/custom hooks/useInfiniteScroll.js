import { useEffect, useRef, useState, useCallback } from 'react';

const useInfiniteScroll = (fetchMore, hasMore, isLoading) => {
  const [observer, setObserver] = useState(null);
  const lastElementRef = useRef(null);
  const loadingRef = useRef(isLoading);

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loadingRef.current) {
      fetchMore();
    }
  }, [fetchMore, hasMore]);

  useEffect(() => {
    if (observer) {
      observer.disconnect();
    }

    const newObserver = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    setObserver(newObserver);

    return () => {
      if (newObserver) {
        newObserver.disconnect();
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    if (lastElementRef.current && observer) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (observer && lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [observer, lastElementRef]);

  return lastElementRef;
};

export default useInfiniteScroll;