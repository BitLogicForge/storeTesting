import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createSliceHelpers } from './slice.helpers';

type State = {
  myItems: number[];
};
const initialState: State = {
  myItems: [1, 2, 3, 4, 5],
};
const nameScope = 'testfourSlice';

const { createValueSetter } = createSliceHelpers<State>(nameScope);

const slice = createSlice({
  name: nameScope,
  initialState: initialState,
  reducers: {
    // path is baked in at definition time → value type is inferred from the path
    setItem: createValueSetter('myItems'),
  },
});

const sumItems = (items: number[]) => items.reduce((s, x) => s + x, 0);
const multiplyItems = (items: number[]) => items.reduce((p, x) => p * x, 1);

type SliceState = Record<typeof nameScope, State>;

export const { setItem } = slice.actions;
export const selectMyItems = (state: SliceState) => state[nameScope].myItems;
export const selectSumAllItems = createSelector(selectMyItems, sumItems);
export const selectMultiplyAllItems = createSelector(selectMyItems, multiplyItems);
export default slice.reducer;
