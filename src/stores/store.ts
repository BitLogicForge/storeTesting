import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../notifications/notificationSlice';
import appReducer from './slices/appSlice';
import exampleReducer from './slices/exampleSlice';
import testOneReducer from './slices/testOneSlice';
export const store = configureStore({
  reducer: {
    example: exampleReducer,
    app: appReducer,
    testOne: testOneReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
