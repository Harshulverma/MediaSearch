import {createSlice} from "@reduxjs/toolkit";

 const searchSlice = createSlice({
    name:"search",
    initialState:{
        query:"",
        activeTab:'photos',
        results:[],
        loading:false,
        loadingMore:false,
        page:1,
        hasMore:true,
        error:null
    },
    reducers:{
        setQuery(state,action){
            state.query = action.payload
        },
        setSearchQuery(state,action){
            state.query = action.payload
        },
        setActiveTabs(state,action){
            state.activeTab = action.payload
        },
        setResults(state,action){
            const { results, page = 1, hasMore = true } = action.payload
            state.loading = false
            state.loadingMore = false
            state.error = null
            state.results = results
            state.page = page
            state.hasMore = hasMore
        },
        appendResults(state, action) {
            const { items, page, hasMore } = action.payload
            if (items.length === 0) {
                state.page = page
                state.hasMore = hasMore
                state.loadingMore = false
                return
            }
            const seen = new Set(state.results.map((r) => `${r.id}-${r.type}`))
            for (const item of items) {
                const key = `${item.id}-${item.type}`
                if (!seen.has(key)) {
                    seen.add(key)
                    state.results.push(item)
                }
            }
            state.page = page
            state.hasMore = hasMore
            state.loadingMore = false
        },
        setLoadingMore(state, action) {
            state.loadingMore = action.payload
        },
        setLoading(state){
            state.loading = true
            state.error = null
        },
        setError(state,action){
            state.error = action.payload
            state.loading = false
        },
        clearResults(state){
            state.results = []
            state.query=""
            state.loading = false
            state.loadingMore = false
            state.page = 1
            state.hasMore = true
            state.error = null
        },
        addResults: (state, action) => {
      state.results = [...state.results, ...action.payload];
    },
    }
})

export const {setQuery,setSearchQuery,setActiveTabs,setResults,appendResults,setLoadingMore,setLoading,setError,clearResults,addResults} = searchSlice.actions
export default searchSlice.reducer