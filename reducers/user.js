
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: "" },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.value.token = action.payload;
    },
    // addPlace: (state, action) => {
    //   state.value.places.push(action.payload);  
    // },
    // removePlace: (state, action) => {
    //   state.value.places = state.value.places.filter(e => e.name !== action.payload);
    // },
    // recupePlace: (state, action) => {
    //   state.value.places = action.payload;
    // }
  },
});

export const { addToken, } = userSlice.actions;
export default userSlice.reducer;
