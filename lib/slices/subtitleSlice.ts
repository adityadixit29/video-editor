import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Subtitle {
  id: string
  text: string
  startTime: number
  endTime: number
  font: string
  fontSize: number
  color: string
  position: {
    x: number
    y: number
  }
}

interface SubtitleState {
  subtitles: Subtitle[]
}

const initialState: SubtitleState = {
  subtitles: [],
}

export const subtitleSlice = createSlice({
  name: 'subtitle',
  initialState,
  reducers: {
    addSubtitle: (state, action: PayloadAction<Subtitle>) => {
      state.subtitles.push(action.payload)
    },
    updateSubtitle: (state, action: PayloadAction<{ id: string; changes: Partial<Subtitle> }>) => {
      const { id, changes } = action.payload
      const subtitleIndex = state.subtitles.findIndex(subtitle => subtitle.id === id)
      if (subtitleIndex !== -1) {
        state.subtitles[subtitleIndex] = { ...state.subtitles[subtitleIndex], ...changes }
      }
    },
    removeSubtitle: (state, action: PayloadAction<string>) => {
      state.subtitles = state.subtitles.filter(subtitle => subtitle.id !== action.payload)
    },
    reorderSubtitles: (state, action: PayloadAction<Subtitle[]>) => {
      state.subtitles = action.payload
    },
  },
})

export const {
  addSubtitle,
  updateSubtitle,
  removeSubtitle,
  reorderSubtitles,
} = subtitleSlice.actions

export default subtitleSlice.reducer