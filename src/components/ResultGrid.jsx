import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector, useStore, shallowEqual } from "react-redux";
import {
  fetchPhotos,
  fetchVideos,
  fetchRandomPhotos,
  fetchRandomVideos,
} from "../api/mediaApi";
import {
  setQuery,
  setLoading,
  setError,
  setResults,
  clearResults,
  appendResults,
  setLoadingMore,
} from "../redux/features/searchSlice";
import MasonryGrid from "./MasonryGrid";
import PageLoader from "./PageLoader";

const PHOTOS_PER_PAGE = 30;
const VIDEOS_SEARCH_PER_PAGE = 40;
const VIDEOS_POPULAR_PER_PAGE = 20;

const LS_DEBOUNCE_MS = 500;
const LOAD_MORE_COOLDOWN_MS = 550;
const OBSERVER_ROOT_MARGIN = "100px";

const ResultGrid = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const { query, activeTab, results, loading, loadingMore, error, hasMore } = useSelector(
    (s) => ({
      query: s.search.query,
      activeTab: s.search.activeTab,
      results: s.search.results,
      loading: s.search.loading,
      loadingMore: s.search.loadingMore,
      error: s.search.error,
      hasMore: s.search.hasMore,
    }),
    shallowEqual
  );

  const inFlightRef = useRef(false);
  const loadMoreFnRef = useRef(() => {});
  const persistTimerRef = useRef(null);
  const cooldownUntilRef = useRef(0);

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, []);

  const schedulePersistResults = useCallback(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      try {
        const next = store.getState().search.results;
        localStorage.setItem("currentResults", JSON.stringify(next));
      } catch {
        /* quota / private mode */
      }
    }, LS_DEBOUNCE_MS);
  }, [store]);

  const getData = useCallback(async () => {
    try {
      dispatch(setLoading());

      let data = [];
      let initialHasMore = false;

      if (!query || query.trim() === "") {
        if (activeTab === "photos") {
          const response = await fetchRandomPhotos();
          data = response.map((item) => ({
            id: item.id,
            type: "photo",
            title: item.alt_description || "Random Image",
            thumbnail: item.urls.small,
            src: item.urls.full,
          }));
          initialHasMore = true;
        }

        if (activeTab === "videos") {
          const response = await fetchRandomVideos(1, VIDEOS_POPULAR_PER_PAGE);
          const videos = response.videos || [];
          data = videos.map((item) => ({
            id: item.id,
            type: "video",
            title: item.user.name || "Random Video",
            thumbnail: item.image,
            src: item.video_files[0].link,
          }));
          initialHasMore = videos.length >= VIDEOS_POPULAR_PER_PAGE;
        }
      } else {
        if (activeTab === "photos") {
          const response = await fetchPhotos(query, 1, PHOTOS_PER_PAGE);
          data = response.results.map((item) => ({
            id: item.id,
            type: "photo",
            title: item.alt_description
              ? `${item.alt_description} - ${query}`
              : query,
            thumbnail: item.urls.small,
            src: item.urls.full,
            query: query,
          }));
          const totalPages = response.total_pages ?? 1;
          initialHasMore = totalPages > 1;
        }

        if (activeTab === "videos") {
          const response = await fetchVideos(query, 1, VIDEOS_SEARCH_PER_PAGE);
          const videos = response.videos || [];
          data = videos.map((item) => ({
            id: item.id,
            type: "video",
            title: item.user.name
              ? `${item.user.name} - ${query}`
              : query,
            thumbnail: item.image,
            src: item.video_files[0].link,
            query: query,
          }));
          const totalResults = response.total_results ?? 0;
          initialHasMore =
            totalResults > 0
              ? data.length < totalResults
              : videos.length >= VIDEOS_SEARCH_PER_PAGE;
        }
      }

      dispatch(
        setResults({
          results: data,
          page: 1,
          hasMore: initialHasMore,
        })
      );

      try {
        localStorage.setItem("currentResults", JSON.stringify(data));
      } catch {
        /* ignore */
      }
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [query, activeTab, dispatch]);

  const loadMore = useCallback(async () => {
    const s = store.getState().search;
    const now = Date.now();
    if (
      s.activeTab === "videos" ||
      !s.hasMore ||
      s.loading ||
      s.loadingMore ||
      inFlightRef.current ||
      now < cooldownUntilRef.current
    ) {
      return;
    }

    inFlightRef.current = true;
    dispatch(setLoadingMore(true));

    const nextPage = s.page + 1;
    const q = s.query?.trim() ?? "";
    const tab = s.activeTab;

    try {
      let newData = [];
      let nextHasMore = false;

      if (!q) {
        if (tab === "photos") {
          const response = await fetchRandomPhotos();
          newData = response.map((item) => ({
            id: item.id,
            type: "photo",
            title: item.alt_description || "Random Image",
            thumbnail: item.urls.small,
            src: item.urls.full,
          }));
          nextHasMore = true;
        } else {
          const response = await fetchRandomVideos(nextPage, VIDEOS_POPULAR_PER_PAGE);
          const videos = response.videos || [];
          newData = videos.map((item) => ({
            id: item.id,
            type: "video",
            title: item.user.name || "Random Video",
            thumbnail: item.image,
            src: item.video_files[0].link,
          }));
          nextHasMore = videos.length >= VIDEOS_POPULAR_PER_PAGE;
        }
      } else {
        if (tab === "photos") {
          const response = await fetchPhotos(q, nextPage, PHOTOS_PER_PAGE);
          newData = response.results.map((item) => ({
            id: item.id,
            type: "photo",
            title: item.alt_description
              ? `${item.alt_description} - ${q}`
              : q,
            thumbnail: item.urls.small,
            src: item.urls.full,
            query: q,
          }));
          const totalPages = response.total_pages ?? 1;
          nextHasMore = nextPage < totalPages;
        } else {
          const response = await fetchVideos(q, nextPage, VIDEOS_SEARCH_PER_PAGE);
          const videos = response.videos || [];
          newData = videos.map((item) => ({
            id: item.id,
            type: "video",
            title: item.user.name ? `${item.user.name} - ${q}` : q,
            thumbnail: item.image,
            src: item.video_files[0].link,
            query: q,
          }));
          const totalResults = response.total_results ?? 0;
          nextHasMore =
            totalResults > 0
              ? nextPage * VIDEOS_SEARCH_PER_PAGE < totalResults
              : videos.length >= VIDEOS_SEARCH_PER_PAGE;
        }
      }

      if (newData.length === 0) {
        dispatch(
          appendResults({
            items: [],
            page: s.page,
            hasMore: false,
          })
        );
        return;
      }

      dispatch(
        appendResults({
          items: newData,
          page: nextPage,
          hasMore: nextHasMore,
        })
      );

      cooldownUntilRef.current = Date.now() + LOAD_MORE_COOLDOWN_MS;
      schedulePersistResults();
    } catch {
      dispatch(setLoadingMore(false));
    } finally {
      inFlightRef.current = false;
    }
  }, [dispatch, store, schedulePersistResults]);

  loadMoreFnRef.current = loadMore;

  const sentinelRef = useRef(null);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (activeTab === "videos") return;
    if (!hasMore || loading) return;

    const el = sentinelRef.current;
    if (!el) return;

    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          const st = store.getState().search;
          if (st.loading || st.loadingMore || inFlightRef.current) return;
          loadMoreFnRef.current();
        });
      },
      { root: null, rootMargin: OBSERVER_ROOT_MARGIN, threshold: 0 }
    );

    observer.observe(el);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [hasMore, loading, query, activeTab, store]);

  if (error) return <h1>Something went wrong !</h1>;
  if (loading) {
    return <PageLoader message="Fetching media" />;
  }

  return (
    <div>
      {results.length > 0 && query.trim() !== "" && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 mb-4">
          <h2 className="text-white text-lg font-semibold">
            {results.length} results for "{query}"
          </h2>
          <button
            type="button"
            onClick={() => {
              dispatch(setQuery(""));
              dispatch(clearResults());
            }}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.02] px-4 py-2.5 text-sm font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-rose-400/45 hover:from-rose-500/20 hover:to-rose-600/10 hover:text-rose-50 hover:shadow-[0_0_24px_-4px_rgba(244,63,94,0.35)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <svg
              className="h-4 w-4 text-rose-300/70 transition-colors group-hover:text-rose-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear results
          </button>
        </div>
      )}

      <MasonryGrid results={results} />

      {activeTab !== "videos" && hasMore && results.length > 0 && (
        <div
          ref={sentinelRef}
          className="flex min-h-12 w-full flex-col items-center justify-center py-6"
          aria-hidden
        />
      )}

      {loadingMore && (
        <div className="flex justify-center pb-10 pt-2" role="status" aria-live="polite">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/70 backdrop-blur-sm">
            <span
              className="h-4 w-4 shrink-0 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin"
              aria-hidden
            />
            Loading more…
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultGrid;
