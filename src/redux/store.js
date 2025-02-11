// Redux State Management Tools
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from '~/redux/activeBoard/activeBoardSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
  }
})
