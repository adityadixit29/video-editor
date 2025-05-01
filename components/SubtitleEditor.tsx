'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { 
  Subtitle, 
  addSubtitle, 
  updateSubtitle, 
  removeSubtitle 
} from '@/lib/slices/subtitleSlice'

const SubtitleEditor = () => {
  const dispatch = useDispatch()
  const { subtitles } = useSelector((state: RootState) => state.subtitle)
  const { currentTime, uploadedVideo } = useSelector((state: RootState) => state.video)
  
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null)
  const [newSubtitleText, setNewSubtitleText] = useState('')
  
  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'
  ]
  
  const colorOptions = [
    '#FFFFFF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF0000', '#00FF00', '#0000FF'
  ]
  
  const handleAddSubtitle = () => {
    if (!uploadedVideo || !newSubtitleText.trim()) return
    
    const newSubtitle: Subtitle = {
      id: Date.now().toString(),
      text: newSubtitleText,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, uploadedVideo.duration),
      font: 'Arial',
      fontSize: 24,
      color: '#FFFFFF',
      position: {
        x: 50, // Center horizontally
        y: 10, // Near bottom
      },
    }
    
    dispatch(addSubtitle(newSubtitle))
    setNewSubtitleText('')
  }
  
  const handleEditSubtitle = (subtitle: Subtitle) => {
    setEditingSubtitle(subtitle)
    setNewSubtitleText(subtitle.text)
  }
  
  const handleUpdateSubtitle = () => {
    if (!editingSubtitle || !newSubtitleText.trim()) return
    
    dispatch(updateSubtitle({
      id: editingSubtitle.id,
      changes: {
        text: newSubtitleText,
        // Other properties remain the same
      }
    }))
    
    setEditingSubtitle(null)
    setNewSubtitleText('')
  }
  
  const handleCancelEdit = () => {
    setEditingSubtitle(null)
    setNewSubtitleText('')
  }
  
  const handleRemoveSubtitle = (id: string) => {
    dispatch(removeSubtitle(id))
    
    if (editingSubtitle?.id === id) {
      setEditingSubtitle(null)
      setNewSubtitleText('')
    }
  }
  
  const handleFontChange = (id: string, font: string) => {
    dispatch(updateSubtitle({
      id,
      changes: { font }
    }))
  }
  
  const handleFontSizeChange = (id: string, fontSize: number) => {
    dispatch(updateSubtitle({
      id,
      changes: { fontSize }
    }))
  }
  
  const handleColorChange = (id: string, color: string) => {
    dispatch(updateSubtitle({
      id,
      changes: { color }
    }))
  }
  
  const handlePositionChange = (id: string, axis: 'x' | 'y', value: number) => {
    const subtitle = subtitles.find(s => s.id === id)
    if (!subtitle) return
    
    dispatch(updateSubtitle({
      id,
      changes: {
        position: {
          ...subtitle.position,
          [axis]: value
        }
      }
    }))
  }
  
  return (
    <div className="subtitle-editor">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Subtitles</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtitleText}
            onChange={(e) => setNewSubtitleText(e.target.value)}
            placeholder="Enter subtitle text..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          
          {editingSubtitle ? (
            <div className="flex gap-1">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                onClick={handleUpdateSubtitle}
              >
                Update
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              onClick={handleAddSubtitle}
              disabled={!newSubtitleText.trim()}
            >
              Add Subtitle
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Current position: {formatTime(currentTime)}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {subtitles.map((subtitle) => (
          <div key={subtitle.id} className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{subtitle.text}</div>
                <div className="text-xs text-gray-500">
                  {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                  onClick={() => handleEditSubtitle(subtitle)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                  onClick={() => handleRemoveSubtitle(subtitle.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Font</label>
                <select
                  value={subtitle.font}
                  onChange={(e) => handleFontChange(subtitle.id, e.target.value)}
                  className="w-full text-sm p-1 border border-gray-300 rounded"
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Size</label>
                <input
                  type="number"
                  value={subtitle.fontSize}
                  onChange={(e) => handleFontSizeChange(subtitle.id, parseInt(e.target.value))}
                  min="12"
                  max="72"
                  className="w-full text-sm p-1 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">Color</label>
              <div className="flex gap-1">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${subtitle.color === color ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(subtitle.id, color)}
                  ></button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position X (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subtitle.position.x}
                  onChange={(e) => handlePositionChange(subtitle.id, 'x', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position Y (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subtitle.position.y}
                  onChange={(e) => handlePositionChange(subtitle.id, 'y', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
        
        {subtitles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No subtitles added yet
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default SubtitleEditor