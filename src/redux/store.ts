import { configureStore } from '@reduxjs/toolkit'
// ...
import userReducer from './userSlice'

export const store = configureStore({   //configureStore is a function that accepts a single object as an argument, which contains the reducer functions and other options for the store configuration. It returns a Redux store that is configured with the provided reducers and options.
  reducer: {
    user: userReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch