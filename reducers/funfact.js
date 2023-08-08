import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { 
      title: '',
      text: '',
     },
  };

  
export const funFactSlice = createSlice({
  name: 'funfact',
  initialState,

  reducers: {
    recupeFunFact: (state, action) => {
      state.value = {
        title: action.payload.title,
        text: action.payload.text,
      }
    },  
  },
});

export const { recupeFunFact } = funFactSlice.actions;
export default funFactSlice.reducer;
