import type { PayloadAction } from '@reduxjs/toolkit';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

// Entity shape
type Product = {
  id: number;
  name: string;
  price: number;
};

// createEntityAdapter provides:
//   - a normalized state shape: { ids: [], entities: {} }
//   - pre-built CRUD reducers: addOne, addMany, setOne, setMany, updateOne, updateMany, removeOne, removeMany, upsertOne, upsertMany, removeAll, setAll
//   - memoized selectors: selectAll, selectById, selectIds, selectEntities, selectTotal
const productsAdapter = createEntityAdapter<Product>();

type State = ReturnType<typeof productsAdapter.getInitialState> & {
  selectedId: number | null;
};

const initialState: State = productsAdapter.getInitialState({
  selectedId: null,
  // adapter state: ids: [], entities: {}
  // pre-populated with some items:
  ...productsAdapter.setAll(productsAdapter.getInitialState(), [
    { id: 1, name: 'Apple', price: 1.5 },
    { id: 2, name: 'Banana', price: 0.75 },
    { id: 3, name: 'Cherry', price: 3.0 },
  ]),
});

const nameScope = 'testfiveSlice';

const slice = createSlice({
  name: nameScope,
  initialState,
  reducers: {
    // Adapter CRUD reducers wired directly
    addProduct: productsAdapter.addOne,
    addProducts: productsAdapter.addMany,
    updateProduct: productsAdapter.updateOne,
    removeProduct: productsAdapter.removeOne,
    upsertProduct: productsAdapter.upsertOne,

    // Custom reducer alongside adapter reducers
    selectProduct: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
  },
});

// Selector base for the adapter — scopes selectors to this slice in the root state
type SliceState = Record<typeof nameScope, State>;

const adapterSelectors = productsAdapter.getSelectors((state: SliceState) => state[nameScope]);

// Adapter-provided memoized selectors
export const selectAllProducts = adapterSelectors.selectAll; // Product[]
export const selectProductById = adapterSelectors.selectById; // (state, id) => Product | undefined
export const selectProductIds = adapterSelectors.selectIds; // (string | number)[]
export const selectTotalProducts = adapterSelectors.selectTotal; // number

// Custom selectors built on top
export const selectSelectedId = (state: SliceState) => state[nameScope].selectedId;

export const selectSelectedProduct = createSelector(
  selectAllProducts,
  selectSelectedId,
  (products, selectedId) => products.find(p => p.id === selectedId) ?? null,
);

export const selectTotalValue = createSelector(selectAllProducts, products =>
  products.reduce((sum, p) => sum + p.price, 0),
);

export const { addProduct, addProducts, updateProduct, removeProduct, upsertProduct, selectProduct } = slice.actions;
export default slice.reducer;
