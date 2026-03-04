# Redux Slices — Overview

This folder contains Redux slice definitions and the helper utilities used to build them.
The `test*` files are intentional learning examples — each one isolates a specific Redux Toolkit pattern so you can study or copy-paste the approach you need.

---

## Helper Utilities

### `slice.helpers.ts`
Factory for **flat** slices (`State` is a plain object).

```ts
const helpers = createSliceHelpers<State>(scope);
```

| Helper | Payload | What it does |
|---|---|---|
| `createValueSetter(field)` | `value: T` | Sets a scalar field; skips if unchanged |
| `createBoolToggler(field)` | _(none)_ | Flips a boolean field |
| `createValueSetterToDict(field)` | `{ dictKey, value }` | Sets a value inside a `Record<string, V>` field |
| `createRemoveKeyFromDict(field)` | `{ dictKey }` | Deletes a key from a `Record<string, V>` field |
| `createBoolTogglerToDict(field)` | `{ dictKey }` | Toggles a boolean inside a dict field |
| `createValueItemsSetter(field)` | `value: T` | Adds/removes an item in an array field (toggle behaviour) |

All helpers log every change to the console with `[scope][field]` prefixes.

---

### `slice-nested.helpers.ts`
Factory for **keyed/nested** slices (`State = Record<string, Entry>`).
Every reducer receives an extra `key` in its payload to target the correct entry.
If the entry doesn't exist yet it is **auto-initialized** from `initialEntry`.

```ts
const helpers = createNestedSliceHelpers<Entry>(scope, initialEntry);
```

| Helper | Payload | What it does |
|---|---|---|
| `createValueSetter(field)` | `{ key, value }` | Sets a field on a specific entry |
| `createBoolToggler(field)` | `{ key }` | Toggles a boolean on a specific entry |
| `createValueSetterToDict(field)` | `{ key, dictKey, value }` | Sets a value in a dict field on a specific entry |
| `createRemoveKeyFromDict(field)` | `{ key, dictKey }` | Removes a dict key on a specific entry |
| `createBoolTogglerToDict(field)` | `{ key, dictKey }` | Toggles a boolean in a dict field on a specific entry |
| `createValueItemsSetter(field)` | `{ key, value }` | Adds/removes an item in an array field on a specific entry |
| `createEntryRemover()` | `{ key }` | Deletes an entire entry from the state |

---

### `slice-deep.helpers.ts`
Factory for slices with **deeply nested** state.
The path to the target leaf is baked in at definition time; TypeScript infers the correct payload type from the path automatically.

```ts
const { createDeepValueSetter } = createDeepSliceHelpers<State>(scope);
createDeepValueSetter(['nest1', 'nest2', 'field'] as const)
```

| Helper | Payload | What it does |
|---|---|---|
| `createDeepValueSetter(path)` | `value: DeepGet<State, Path>` | Sets the value at an arbitrary nested path |

---

## Slices

### `appSlice.ts`
**Purpose:** Global application state — currently only dark/light theme.
**Pattern:** Plain hand-written reducers (no helpers needed for this minimal state).
**Actions:** `toggleTheme`, `setDarkTheme`

---

### `exampleSlice.ts`
**Purpose:** Minimal starter/template slice.
**Pattern:** Plain hand-written reducers.
**Actions:** `setExample`, `clear`

---

### `test1Slice.ts` — Flat slice + `createSliceHelpers`
**Pattern:** Flat state, all helpers from `slice.helpers.ts`.
**Use when:** State is a plain object and you want concise, type-safe reducer definitions with no boilerplate.
**Demonstrates:** `createValueSetter`, `createBoolToggler`, `createValueSetterToDict`, `createRemoveKeyFromDict`

---

### `test2Slice.ts` — Nested (keyed) slice + `createNestedSliceHelpers`
**Pattern:** `State = Record<string, Entry>`, helpers from `slice-nested.helpers.ts`.
**Use when:** You have multiple dynamic instances of the same shape (e.g. per-user, per-tab, per-session).
**Demonstrates:** All nested helpers including auto-initialization and `createEntryRemover`

---

### `test3Slice.ts` — Deeply nested state + `createDeepValueSetter`
**Pattern:** Multi-level nested state, path-based setters from `slice-deep.helpers.ts`.
**Use when:** You can't flatten the state and need type-safe access to deeply nested leaves.
**Demonstrates:** `createDeepValueSetter` with paths of 1–4 segments

---

### `test4Slice.ts` — Derived state + `createSelector`
**Pattern:** Flat slice with memoized selectors built via `createSelector`.
**Use when:** A component needs a value *calculated* from stored state (sums, filters, transforms) and you want to avoid re-computing on every render.
**Demonstrates:** `createSelector` composition, chaining selectors

---

### `test5Slice.ts` — Normalized entity collection + `createEntityAdapter`
**Pattern:** `{ ids: [], entities: {} }` normalized shape managed by `createEntityAdapter`.
**Use when:** You store a list of items with unique IDs and need frequent CRUD operations (O(1) lookup by id).
**Demonstrates:** Adapter CRUD reducers (`addOne`, `updateOne`, `removeOne`, `upsertOne`), adapter selectors (`selectAll`, `selectById`, `selectTotal`), mixing custom state + adapter state

---

### `test6Slice.ts` — Async operations + `createAsyncThunk`
**Pattern:** `createAsyncThunk` + `extraReducers` for API calls.
**Use when:** You need to fetch data or run any async operation that should update the store.
**Demonstrates:** `createAsyncThunk` lifecycle (`pending` / `fulfilled` / `rejected`), `rejectWithValue`, `builder.addCase`, thunk with and without arguments
