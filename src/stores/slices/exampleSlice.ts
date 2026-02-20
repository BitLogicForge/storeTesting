import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TState = {
  exampleData: string;
};

const initialState: TState = {
  exampleData: 'Initial data',
};

const slice = createSlice({
  name: 'exampleSlice',
  initialState,
  reducers: {
    setExample: (state, action: PayloadAction<string>) => {
      state.exampleData = action.payload;
    },
    clear: state => {
      state.exampleData = 'cleared';
    },
  },
});

export const { setExample, clear } = slice.actions;
export default slice.reducer;
