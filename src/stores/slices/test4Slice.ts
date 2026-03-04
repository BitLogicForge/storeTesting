/**
 * TEST 4 — Derived / computed state with `createSelector`
 *
 * Demonstrates how to derive new values from slice state using
 * memoized selectors so that expensive computations only re-run
 * when the relevant state actually changes.
 *
 * Key concepts covered:
 * - `createSelector` (from Redux Toolkit / reselect): composes input
 *    selectors and a result function; the result is cached until inputs change.
 * - Chaining selectors: `selectSumAllItems` and `selectMultiplyAllItems`
 *    both build on `selectMyItems` — only one input selector needed.
 * - Flat slice still uses `createSliceHelpers` for the reducer.
 *
 * When to use this pattern:
 * Any time a component needs a value that is *calculated* from stored state
 * (sums, filters, mappings) — avoids re-computing on every render.
 */
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

function sumItems(items: number[]) {
  return items.reduce((s, x) => s + x, 0);
}
function multiplyItems(items: number[]) {
  return items.reduce((p, x) => p * x, 1);
}

type SliceState = Record<typeof nameScope, State>;

export const { setItem } = slice.actions;
export const selectMyItems = (state: SliceState) => state[nameScope].myItems;
export const selectSumAllItems = createSelector(selectMyItems, sumItems);
export const selectMultiplyAllItems = createSelector(selectMyItems, multiplyItems);
export default slice.reducer;
