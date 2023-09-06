import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/slice'

export const store = configureStore({
    reducer: userReducer,
})