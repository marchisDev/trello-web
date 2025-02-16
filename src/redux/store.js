// Redux State Management Tools
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from '~/redux/activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
/**
 * Cau hinh redux-persist
 * https://www.npmjs.com/package/redux-persist
 * Cau hinh redux-persist de hieu
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */

// Cau hinh persist
const rootPersistConfig = {
  key: 'root', // key cua cai persist do chung ta chi dinh, cu de mac dinh la root
  storage: storage, // Bien storage o tren - luu vao local storage
  whitelist: ['user'] // dinh nghia cac slice du lieu DUOC PHEP duy tri khi F5 trinh duyet
  // blacklist: ['activeBoard'] // dinh nghia cac slice du lieu KHONG DUOC PHEP duy tri khi F5 trinh duyet
}

// Combine reducers trong du an cua chung ta o day
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})
