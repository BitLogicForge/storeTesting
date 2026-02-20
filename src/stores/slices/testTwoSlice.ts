import { createSlice } from '@reduxjs/toolkit';
import { createSliceHelpers } from './slice.helpers';

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

const {} = createSliceHelpers<State>(nameScope);

const slice = createSlice({
  name: nameScope,
  initialState: initialState,
  reducers: {
    // setExampleVarStr: createValueSetter('exampleVarStr'),
    // setExampleVarNum: createValueSetter('exampleVarNum'),
    // setExampleVarBool: createValueSetter('exampleVarBool'),
    // setExampleSentiment: createValueSetter('exampleSentiment'),
    // setExampleToggle: createBoolToggler('exampleToggle'),
    // setDictOfValues: createValueSetterToDict('dictOfValues'),
    // setDictOfNumValues: createValueSetterToDict('dictOfNumValues'),
    // removeKeyFromDict: createRemoveKeyFromDict('dictOfValues'),
  },
});

export const {} = slice.actions;
export default slice.reducer;
