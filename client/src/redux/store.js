import { combineReducers, configureStore } from '@reduxjs/toolkit'
import useReducer from './user/userSlice'
import { persistReducer , persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({user: useReducer}) //combine all reducers

const presistConfig = {
    key: 'root',        //key for local storage
    storage,            //storage type
    version: 1,         

} //config redux persist

const persistedReducer = persistReducer(presistConfig, rootReducer) //create persisted reducer

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store)