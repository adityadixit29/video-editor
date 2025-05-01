import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TextOverlay {
  id: string
  type: 'text'
  text: string
  font: string
  fontSize: number
  color: string
  position: { x: number; y: number }
  startTime: number
  endTime: number
}

export interface ImageOverlay {
  id: string
  type: 'image'
  src: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  opacity: number
  border: { width: number; color: string; style: string }
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
      const { id, changes } = action.payload;
      const index = state.overlays.findIndex(overlay => overlay.id === id);
      if (index !== -1) {
        const existing = state.overlays[index];
        if (existing.type === 'text') {
          state.overlays[index] = {
            ...(existing as TextOverlay),
            ...(changes as Partial<TextOverlay>),
          };
        } else if (existing.type === 'image') {
          state.overlays[index] = {
            ...(existing as ImageOverlay),
            ...(changes as Partial<ImageOverlay>),
          };
        }
      }
    },
    removeOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(overlay => overlay.id !== action.payload)
    },
    updateOverlayPosition: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload
      const index = state.overlays.findIndex(overlay => overlay.id === id)
      if (index !== -1) {
        state.overlays[index] = {
          ...state.overlays[index],
          position,
        }
      }
    },
    updateImageOverlaySize: (state, action: PayloadAction<{ id: string; size: { width: number; height: number } }>) => {
      const { id, size } = action.payload
      const index = state.overlays.findIndex(overlay => overlay.id === id && overlay.type === 'image')
      if (index !== -1) {
        (state.overlays[index] as ImageOverlay).size = size
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
