// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
   searchInput:(state,action)=>{
    // console.log(action.payload)
    return state=action.payload; 
   },
  }
});

export const { searchInput } = searchSlice.actions;
export default searchSlice.reducer;
