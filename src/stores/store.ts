import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import notificationReducer from '../notifications/notificationSlice';
import appReducer from './slices/appSlice';
import exampleReducer from './slices/exampleSlice';
import testOneReducer from './slices/test1Slice';

// Persist only exampleVarNum from testOneSlice
const testOnePersistConfig = {
  key: 'testOne',
  storage,
  whitelist: ['exampleVarNum'],
};

const rootReducer = combineReducers({
  example: exampleReducer,
  app: appReducer,
  testOne: persistReducer(testOnePersistConfig, testOneReducer),
  notifications: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
