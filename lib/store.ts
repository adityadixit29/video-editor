import { configureStore } from '@reduxjs/toolkit'
import videoReducer from './slices/videoSlice'
import audioReducer from './slices/audioSlice'
import subtitleReducer from './slices/subtitleSlice'
import overlayReducer from './slices/overlaySlice'

export const store = configureStore({
  reducer: {
    video: videoReducer,
    audio: audioReducer,
    subtitle: subtitleReducer,
    overlay: overlayReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch