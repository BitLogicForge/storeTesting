/**
 * TEST 1 — Flat slice with custom slice helpers
 *
 * Demonstrates the most basic and common pattern:
 * a flat Redux slice where all state lives at the top level.
 *
 * Key concepts covered:
 * - `createSliceHelpers` factory: reduces boilerplate by generating
 *    type-safe reducers without writing them by hand.
 * - `createValueSetter`   → sets any scalar field (string, number, boolean, union type)
 * - `createBoolToggler`   → flips a boolean field without a payload
 * - `createValueSetterToDict` → sets a value inside a `Record<string, V>` field by key
 * - `createRemoveKeyFromDict` → deletes a key from a `Record<string, V>` field
 *
 * When to use this pattern:
 * Simple, non-nested state where you want concise reducer definitions
 * and automatic console logging of every state change.
 */
import { createSlice } from '@reduxjs/toolkit';
import { createSliceHelpers } from './slice.helpers';

type TSentiment = 'positive' | 'neutral' | 'negative';

type State = {
  exampleVarStr: string;
  exampleVarNum: number;
  exampleVarBool: boolean;
  exampleSentiment: TSentiment;
  exampleToggle: boolean;
  dictOfValues: Record<string, string>;
  dictOfNumValues: Record<string, number[]>;
};

const initialState: State = {
  exampleVarStr: 'Initial string',
  exampleVarNum: 0,
  exampleVarBool: false,
  exampleSentiment: 'neutral',
  exampleToggle: false,
  dictOfValues: {},
  dictOfNumValues: {},
};

const nameScope = 'testOneSlice';

const { createValueSetter, createBoolToggler, createValueSetterToDict, createRemoveKeyFromDict } =
  createSliceHelpers<State>(nameScope);

const slice = createSlice({
  name: nameScope,
  initialState,
  reducers: {
    setExampleVarStr: createValueSetter('exampleVarStr'),
    setExampleVarNum: createValueSetter('exampleVarNum'),
    setExampleVarBool: createValueSetter('exampleVarBool'),
    setExampleSentiment: createValueSetter('exampleSentiment'),
    setExampleToggle: createBoolToggler('exampleToggle'),
    setDictOfValues: createValueSetterToDict('dictOfValues'),
    setDictOfNumValues: createValueSetterToDict('dictOfNumValues'),
    removeKeyFromDict: createRemoveKeyFromDict('dictOfValues'),
  },
});

export const {
  setExampleVarStr,
  setExampleVarNum,
  setExampleVarBool,
  setExampleSentiment,
  setExampleToggle,
  setDictOfValues,
  removeKeyFromDict,
} = slice.actions;
export default slice.reducer;
