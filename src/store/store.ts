import { configureStore } from '@reduxjs/toolkit';
import couterReducer from "./slices/counterSlice"
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    counter: couterReducer,
    user: userReducer 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;