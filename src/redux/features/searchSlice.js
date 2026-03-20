import {createSlice} from "@reduxjs/toolkit";

 const searchSlice = createSlice({
    name:"search",
    initialState:{
        query:"",
        activeTab:'photos',
        results:[],
        loading:false,
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
            state.loading = false
            state.results = action.payload
        },
        setLoading(state){
            state.loading = true,
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
            state.error = null
        },
        addResults: (state, action) => {
      state.results = [...state.results, ...action.payload];
    },
    }
})

export const {setQuery,setSearchQuery,setActiveTabs,setResults,setLoading,setError,clearResults,addResults} = searchSlice.actions
export default searchSlice.reducer