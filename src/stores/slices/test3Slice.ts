/**
 * TEST 3 — Deeply nested slice with path-based value setters
 *
 * Demonstrates how to manage state that is deeply nested (multiple levels)
 * without writing a separate reducer for every leaf field.
 *
 * Key concepts covered:
 * - `createDeepSliceHelpers` factory: generates reducers that navigate an
 *    arbitrary path inside the state tree to set a leaf value.
 * - `createDeepValueSetter(['a', 'b', 'c'] as const)` — the path is baked
 *    in at definition time, and TypeScript infers the correct payload type
 *    from the path, giving full type safety.
 * - Supports paths of any depth (1, 2, 3, … levels).
 *
 * When to use this pattern:
 * Deeply nested configuration or UI state where flattening the structure
 * isn't practical, but you still want concise, type-safe reducers.
 */
import { createSlice } from '@reduxjs/toolkit';
import { createDeepSliceHelpers } from './slice-deep.helpers';

type State = {
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

const initialState: State = {
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

const nameScope = 'testThreeSlice';

const { createDeepValueSetter } = createDeepSliceHelpers<State>(nameScope);

const slice = createSlice({
  name: nameScope,
  initialState: initialState,
  reducers: {
    // path is baked in at definition time → value type is inferred from the path
    setExampleVarStr: createDeepValueSetter(['exampleVarStr'] as const),
    setExampleVarNum: createDeepValueSetter(['exampleVarNum'] as const),
    setNest1VarStr: createDeepValueSetter(['nest1', 'exampleVarStr'] as const),
    setNest1VarNum: createDeepValueSetter(['nest1', 'exampleVarNum'] as const),
    setNest2VarStr: createDeepValueSetter(['nest1', 'nest2', 'exampleVarStr'] as const),
    setNest2VarNum: createDeepValueSetter(['nest1', 'nest2', 'exampleVarNum'] as const),
    setNest3VarStr: createDeepValueSetter(['nest1', 'nest2', 'nest3', 'exampleVarStr'] as const),
    setNest3VarNum: createDeepValueSetter(['nest1', 'nest2', 'nest3', 'exampleVarNum'] as const),
  },
});

export const {
  setExampleVarStr,
  setExampleVarNum,
  setNest1VarStr,
  setNest1VarNum,
  setNest2VarStr,
  setNest2VarNum,
  setNest3VarStr,
  setNest3VarNum,
} = slice.actions;
export default slice.reducer;
