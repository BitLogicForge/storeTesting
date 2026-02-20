import { createSlice } from '@reduxjs/toolkit';

type StateEntry = {
  nest1: {
    nest2: {
      nest3: {
        exampleVarStr: string;
        exampleVarNum: number;
        //other dynamic keys can be added here
      };
      exampleVarStr: string;
      exampleVarNum: number;
    };
    exampleVarStr: string;
    exampleVarNum: number;
  };
  exampleVarStr: string;
  exampleVarNum: number;
};

const initialStateEntry: StateEntry = {
  nest1: {
    nest2: {
      nest3: {
        exampleVarStr: 'Initial string nest3',
        exampleVarNum: 3,
      },
      exampleVarStr: 'Initial string nest2',
      exampleVarNum: 2,
    },
    exampleVarStr: 'Initial string nest1',
    exampleVarNum: 1,
  },
  exampleVarStr: 'Initial string',
  exampleVarNum: 0,
};

type State = Record<string, StateEntry>;
const initialState: State = {
  entry1: { ...initialStateEntry },
};

const nameScope = 'testTwoSlice';

const slice = createSlice({
  name: nameScope,
  initialState: initialState,
  reducers: {},
});

export const {} = slice.actions;
export default slice.reducer;
