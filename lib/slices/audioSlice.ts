import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AudioTrack {
  id: string
  src: string
  name: string
  startTime: number
  endTime: number
  volume: number
  isMuted: boolean
  type: 'original' | 'background' | 'voiceover'
}

interface AudioState {
  tracks: AudioTrack[]
  masterVolume: number
}

const initialState: AudioState = {
  tracks: [],
  masterVolume: 1.0,
}

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    addAudioTrack: (state, action: PayloadAction<AudioTrack>) => {
      state.tracks.push(action.payload)
    },
    updateAudioTrack: (state, action: PayloadAction<{ id: string; changes: Partial<AudioTrack> }>) => {
      const { id, changes } = action.payload
      const trackIndex = state.tracks.findIndex(track => track.id === id)
      if (trackIndex !== -1) {
        state.tracks[trackIndex] = { ...state.tracks[trackIndex], ...changes }
      }
    },
    removeAudioTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload)
    },
    reorderAudioTracks: (state, action: PayloadAction<AudioTrack[]>) => {
      state.tracks = action.payload
    },
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = action.payload
    },
    toggleMuteTrack: (state, action: PayloadAction<string>) => {
      const trackIndex = state.tracks.findIndex(track => track.id === action.payload)
      if (trackIndex !== -1) {
        state.tracks[trackIndex].isMuted = !state.tracks[trackIndex].isMuted
      }
    },
    setTrackVolume: (state, action: PayloadAction<{ id: string; volume: number }>) => {
      const { id, volume } = action.payload
      const trackIndex = state.tracks.findIndex(track => track.id === id)
      if (trackIndex !== -1) {
        state.tracks[trackIndex].volume = volume
      }
    },
  },
})

export const {
  addAudioTrack,
  updateAudioTrack,
  removeAudioTrack,
  reorderAudioTracks,
  setMasterVolume,
  toggleMuteTrack,
  setTrackVolume,
} = audioSlice.actions

export default audioSlice.reducer