/**
 * TEST 6 — Async operations with `createAsyncThunk`
 *
 * Demonstrates how to handle side effects (API calls, async logic) inside
 * Redux Toolkit without any additional middleware beyond the built-in
 * `redux-thunk`.
 *
 * Key concepts covered:
 * - `createAsyncThunk<ReturnType, ArgType>`: wraps an async function and
 *    automatically dispatches three lifecycle actions:
 *      • `pending`   — request started (show spinner, clear errors)
 *      • `fulfilled` — request succeeded (store the result)
 *      • `rejected`  — request failed (store the error message)
 * - `rejectWithValue`: lets you control the rejected action's payload
 *    instead of serializing the raw Error object.
 * - `extraReducers` / `builder.addCase`: listens for thunk actions from
 *    outside the slice — keeps async logic co-located with its state.
 * - Two thunks shown: one with no argument (`fetchProducts`) and one
 *    with an id argument (`fetchProductById`).
 * - `createSelector` used to derive loading state and total price.
 *
 * When to use this pattern:
 * Any time you need to fetch data, POST to an API, or run any async
 * operation that should update the Redux store.
 */
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

type Product = {
  id: number;
  title: string;
  price: number;
};

type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type State = {
  items: Product[];
  status: FetchStatus;
  error: string | null;
};

const initialState: State = {
  items: [],
  status: 'idle',
  error: null,
};

// createAsyncThunk<ReturnType, ArgType>
// Automatically generates three action types:
//   testSixSlice/fetchProducts/pending
//   testSixSlice/fetchProducts/fulfilled
//   testSixSlice/fetchProducts/rejected
export const fetchProducts = createAsyncThunk<Product[], void>(
  'testSixSlice/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products?limit=5');
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return (await response.json()) as Product[];
    } catch (err) {
      // rejectWithValue lets you control the rejected action's payload
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  },
);

// createAsyncThunk with an argument
export const fetchProductById = createAsyncThunk<Product, number>(
  'testSixSlice/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return (await response.json()) as Product;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  },
);

const nameScope = 'testSixSlice';

const slice = createSlice({
  name: nameScope,
  initialState,
  reducers: {
    // synchronous actions can still coexist
    clearProducts: state => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },

  // extraReducers handles actions from outside this slice (async thunks, other slices)
  extraReducers: builder => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // fetchProductById — merges single result into the list
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const exists = state.items.find(p => p.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      });
  },
});

type SliceState = Record<typeof nameScope, State>;

const selectSlice = (state: SliceState) => state[nameScope];

export const selectProducts = createSelector(selectSlice, s => s.items);
export const selectStatus = createSelector(selectSlice, s => s.status);
export const selectError = createSelector(selectSlice, s => s.error);
export const selectIsLoading = createSelector(selectStatus, status => status === 'loading');

export const selectTotalPrice = createSelector(selectProducts, items => items.reduce((sum, p) => sum + p.price, 0));

export const { clearProducts } = slice.actions;
export default slice.reducer;
