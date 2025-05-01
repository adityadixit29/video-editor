import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TextOverlay {
  id: string
  type: 'text'
  text: string
  font: string
  fontSize: number
  color: string
  position: {
    x: number
    y: number
  }
  startTime: number
  endTime: number
}

export interface ImageOverlay {
  id: string
  type: 'image'
  src: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  opacity: number
  border: {
    width: number
    color: string
    style: string
  }
  startTime: number
  endTime: number
}

export type Overlay = TextOverlay | ImageOverlay

interface OverlayState {
  overlays: Overlay[]
}

const initialState: OverlayState = {
  overlays: [],
}

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    addOverlay: (state, action: PayloadAction<Overlay>) => {
      state.overlays.push(action.payload)
    },
    updateOverlay: (state, action: PayloadAction<{ id: string; changes: Partial<Overlay> }>) => {
      const { id, changes } = action.payload
      const overlayIndex = state.overlays.findIndex(overlay => overlay.id === id)
      if (overlayIndex !== -1) {
        state.overlays[overlayIndex] = { ...state.overlays[overlayIndex], ...changes }
      }
    },
    removeOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(overlay => overlay.id !== action.payload)
    },
    updateOverlayPosition: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload
      const overlayIndex = state.overlays.findIndex(overlay => overlay.id === id)
      if (overlayIndex !== -1) {
        state.overlays[overlayIndex].position = position
      }
    },
    updateImageOverlaySize: (state, action: PayloadAction<{ id: string; size: { width: number; height: number } }>) => {
      const { id, size } = action.payload
      const overlayIndex = state.overlays.findIndex(overlay => overlay.id === id && overlay.type === 'image')
      if (overlayIndex !== -1) {
        (state.overlays[overlayIndex] as ImageOverlay).size = size
      }
    },
  },
})

export const {
  addOverlay,
  updateOverlay,
  removeOverlay,
  updateOverlayPosition,
  updateImageOverlaySize,
} = overlaySlice.actions

export default overlaySlice.reducer