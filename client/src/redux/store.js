import {configureStore} from '@reduxjs/toolkit'
import { authReducer } from './slices/auth'
import { postsReducer } from './slices/posts'

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer
    }
})