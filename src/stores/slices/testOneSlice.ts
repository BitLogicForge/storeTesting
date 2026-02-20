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
