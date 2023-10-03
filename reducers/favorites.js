import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toilet: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",

  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const toiletId = action.payload.id;
      // Check if the toilet with the same ID is already in favorites
      const existingToiletIndex = state.toilet.findIndex(
        (favoriteToilet) => favoriteToilet.id === toiletId
      );
      if (existingToiletIndex === -1) {
        // If the toilet is not already in favorites, add it
        state.toilet.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      state.toilet = state.toilet.filter(
        (favoriteToilet) => favoriteToilet.id !== action.payload.toiletId
      );
    },
  },
});
export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;