import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface VideoSegment {
  id: string
  startTime: number
  endTime: number
  src: string
  thumbnail?: string
}

interface VideoState {
  uploadedVideo: {
    src: string
    duration: number
    thumbnail?: string
  } | null
  segments: VideoSegment[]
  currentTime: number
  isPlaying: boolean
  uploadProgress: number
  isRendering: boolean
  renderProgress: number
}

const initialState: VideoState = {
  uploadedVideo: null,
  segments: [],
  currentTime: 0,
  isPlaying: false,
  uploadProgress: 0,
  isRendering: false,
  renderProgress: 0,
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setUploadedVideo: (state, action: PayloadAction<{ src: string; duration: number; thumbnail?: string }>) => {
      state.uploadedVideo = action.payload
      // Create an initial segment that spans the entire video
      if (action.payload) {
        state.segments = [
          {
            id: '1',
            startTime: 0,
            endTime: action.payload.duration,
            src: action.payload.src,
            thumbnail: action.payload.thumbnail,
          },
        ]
      }
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    addSegment: (state, action: PayloadAction<VideoSegment>) => {
      state.segments.push(action.payload)
    },
    updateSegment: (state, action: PayloadAction<{ id: string; changes: Partial<VideoSegment> }>) => {
      const { id, changes } = action.payload
      const segmentIndex = state.segments.findIndex(segment => segment.id === id)
      if (segmentIndex !== -1) {
        state.segments[segmentIndex] = { ...state.segments[segmentIndex], ...changes }
      }
    },
    removeSegment: (state, action: PayloadAction<string>) => {
      state.segments = state.segments.filter(segment => segment.id !== action.payload)
    },
    reorderSegments: (state, action: PayloadAction<VideoSegment[]>) => {
      state.segments = action.payload
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    startRendering: (state) => {
      state.isRendering = true
      state.renderProgress = 0
    },
    updateRenderProgress: (state, action: PayloadAction<number>) => {
      state.renderProgress = action.payload
    },
    completeRendering: (state) => {
      state.isRendering = false
      state.renderProgress = 100
    },
  },
})

export const {
  setUploadedVideo,
  setUploadProgress,
  addSegment,
  updateSegment,
  removeSegment,
  reorderSegments,
  setCurrentTime,
  setIsPlaying,
  startRendering,
  updateRenderProgress,
  completeRendering,
} = videoSlice.actions

export default videoSlice.reducer