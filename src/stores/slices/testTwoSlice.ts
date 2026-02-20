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
