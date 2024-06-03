// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import expensesReducer from './expensesSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     expenses: expensesReducer,
//   },
// });

// export default store;
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import expensesReducer from './expensesSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  expenses: expensesReducer,
  auth: authReducer,
  theme: themeReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };

