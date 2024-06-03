import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: 'light', // Default theme
  reducers: {
    toggleTheme: (state) => (state === 'light' ? 'dark' : 'light'),
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
