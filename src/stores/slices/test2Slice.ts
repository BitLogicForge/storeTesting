/**
 * TEST 2 — Nested (keyed) slice with custom nested slice helpers
 *
 * Demonstrates a slice whose state is a `Record<string, Entry>` —
 * i.e. a dictionary of identical entry objects identified by a dynamic key
 * (e.g. userId, sessionId, tabId).
 *
 * Key concepts covered:
 * - `createNestedSliceHelpers` factory: same idea as the flat helpers but
 *    every reducer receives an extra `key` in its payload to target the
 *    correct entry.
 * - Auto-initialization: if an entry for the given key doesn't exist yet,
 *    it is created from `initialStateEntry` automatically.
 * - `createValueSetter`       → sets a field on a specific entry
 * - `createBoolToggler`       → toggles a boolean on a specific entry
 * - `createValueSetterToDict` → sets a value inside a dict field on a specific entry
 * - `createRemoveKeyFromDict` → removes a key from a dict field on a specific entry
 * - `createEntryRemover`      → deletes an entire entry from the state
 * - `createValueItemsSetter`  → toggles an item in/out of an array field on a specific entry
 *
 * When to use this pattern:
 * Dynamic, multi-instance state (e.g. per-user, per-tab, per-entity settings)
 * where the set of keys isn't known at build time.
 */
import { createSlice } from '@reduxjs/toolkit';
import { createNestedSliceHelpers } from './slice-nested.helpers';

type TSentiment = 'positive' | 'neutral' | 'negative';

type StateEntry = {
  exampleVarStr: string;
  exampleVarNum: number;
  exampleVarBool: boolean;
  exampleSentiment: TSentiment;
  exampleToggle: boolean;
  dictOfValues: Record<string, string>;
  dictOfNumValues: Record<string, number[]>;
};

const initialStateEntry: StateEntry = {
  exampleVarStr: 'Initial string',
  exampleVarNum: 0,
  exampleVarBool: false,
  exampleSentiment: 'neutral',
  exampleToggle: false,
  dictOfValues: {},
  dictOfNumValues: {},
};

type State = Record<string, StateEntry>;
const initialState: State = {
  entry1: { ...initialStateEntry },
};

const nameScope = 'testTwoSlice';

const { createValueSetter, createBoolToggler, createValueSetterToDict, createRemoveKeyFromDict, createEntryRemover } =
  createNestedSliceHelpers<StateEntry>(nameScope, initialStateEntry);

const slice = createSlice({
  name: nameScope,
  initialState: initialState,
  reducers: {
    setExampleVarStr: createValueSetter('exampleVarStr'),
    setExampleVarNum: createValueSetter('exampleVarNum'),
    setExampleVarBool: createValueSetter('exampleVarBool'),
    setExampleSentiment: createValueSetter('exampleSentiment'),
    setExampleToggle: createBoolToggler('exampleToggle'),
    setDictOfValues: createValueSetterToDict('dictOfValues'),
    setDictOfNumValues: createValueSetterToDict('dictOfNumValues'),
    removeKeyFromDict: createRemoveKeyFromDict('dictOfValues'),
    removeEntry: createEntryRemover(),
  },
});

export const {
  setExampleVarStr,
  setExampleVarNum,
  setExampleVarBool,
  setExampleSentiment,
  setExampleToggle,
  setDictOfValues,
  setDictOfNumValues,
  removeKeyFromDict,
  removeEntry,
} = slice.actions;
export default slice.reducer;
