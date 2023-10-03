import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: { 
    token: null,
    username: null,
    photos: [],
   },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('login action payload:', action.payload);
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
    },
    logout: (state, action) => {
      state.value.token = null
      state.value.username = null
      
    },
    addPhoto: (state, action) => {
      state.value.photos.push(action.payload)
    },
    changeUsername: (state, action) => {
      state.value.username = action.payload;
    },
  },
});

export const { login, logout, addPhoto, changeUsername } = userSlice.actions;
export default userSlice.reducer;
