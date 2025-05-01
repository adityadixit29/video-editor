'use client'

import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { 
  TextOverlay, 
  ImageOverlay, 
  Overlay,
  addOverlay, 
  updateOverlay, 
  removeOverlay 
} from '@/lib/slices/overlaySlice'

const OverlayEditor = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { overlays } = useSelector((state: RootState) => state.overlay)
  const { currentTime, uploadedVideo } = useSelector((state: RootState) => state.video)
  
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [editingOverlay, setEditingOverlay] = useState<Overlay | null>(null)
  
  // Text overlay form state
  const [textOverlayForm, setTextOverlayForm] = useState({
    text: '',
    font: 'Arial',
    fontSize: 24,
    color: '#FFFFFF',
  })
  
  // Image overlay form state
  const [imageOpacity, setImageOpacity] = useState(1)
  const [imageBorderWidth, setImageBorderWidth] = useState(0)
  const [imageBorderColor, setImageBorderColor] = useState('#FFFFFF')
  const [imageBorderStyle, setImageBorderStyle] = useState('solid')
  
  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'
  ]
  
  const colorOptions = [
    '#FFFFFF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF0000', '#00FF00', '#0000FF'
  ]
  
  const borderStyleOptions = [
    'none', 'solid', 'dashed', 'dotted'
  ]
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextOverlayForm({
      ...textOverlayForm,
      text: e.target.value
    })
  }
  
  const handleFontChange = (font: string) => {
    setTextOverlayForm({
      ...textOverlayForm,
      font
    })
  }
  
  const handleFontSizeChange = (fontSize: number) => {
    setTextOverlayForm({
      ...textOverlayForm,
      fontSize
    })
  }
  
  const handleColorChange = (color: string) => {
    setTextOverlayForm({
      ...textOverlayForm,
      color
    })
  }
  
  const handleAddTextOverlay = () => {
    if (!uploadedVideo || !textOverlayForm.text.trim()) return
    
    const newTextOverlay: TextOverlay = {
      id: Date.now().toString(),
      type: 'text',
      text: textOverlayForm.text,
      font: textOverlayForm.font,
      fontSize: textOverlayForm.fontSize,
      color: textOverlayForm.color,
      position: {
        x: 50, // Center horizontally
        y: 50, // Center vertically
      },
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, uploadedVideo.duration),
    }
    
    dispatch(addOverlay(newTextOverlay))
    
    // Reset form
    setTextOverlayForm({
      ...textOverlayForm,
      text: ''
    })
  }
  
  const handleAddImageOverlay = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && uploadedVideo) {
      const imageUrl = URL.createObjectURL(file)
      
      const newImageOverlay: ImageOverlay = {
        id: Date.now().toString(),
        type: 'image',
        src: imageUrl,
        position: {
          x: 50, // Center horizontally
          y: 50, // Center vertically
        },
        size: {
          width: 200,
          height: 200,
        },
        opacity: imageOpacity,
        border: {
          width: imageBorderWidth,
          color: imageBorderColor,
          style: imageBorderStyle,
        },
        startTime: currentTime,
        endTime: Math.min(currentTime + 5, uploadedVideo.duration),
      }
      
      dispatch(addOverlay(newImageOverlay))
    }
  }
  
  const handleRemoveOverlay = (id: string) => {
    dispatch(removeOverlay(id))
    
    if (editingOverlay?.id === id) {
      setEditingOverlay(null)
    }
  }
  
  return (
    <div className="overlay-editor">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Overlays</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b border-gray-200 mb-3">
          <button
            className={`px-3 py-1 ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('text')}
          >
            Text
          </button>
          <button
            className={`px-3 py-1 ${activeTab === 'image' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('image')}
          >
            Image
          </button>
        </div>
        
        {activeTab === 'text' && (
          <div>
            <div className="mb-3">
              <input
                type="text"
                value={textOverlayForm.text}
                onChange={handleTextChange}
                placeholder="Enter text for overlay..."
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Font</label>
                <select
                  value={textOverlayForm.font}
                  onChange={(e) => handleFontChange(e.target.value)}
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
                  value={textOverlayForm.fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  min="12"
                  max="72"
                  className="w-full text-sm p-1 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Color</label>
              <div className="flex gap-1">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${textOverlayForm.color === color ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  ></button>
                ))}
              </div>
            </div>
            
            <button
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              onClick={handleAddTextOverlay}
              disabled={!textOverlayForm.text.trim()}
            >
              Add Text Overlay
            </button>
          </div>
        )}
        
        {activeTab === 'image' && (
          <div>
            <div className="mb-3">
              <button
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                onClick={handleAddImageOverlay}
              >
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={imageOpacity}
                onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Border Width</label>
              <input
                type="range"
                min="0"
                max="10"
                value={imageBorderWidth}
                onChange={(e) => setImageBorderWidth(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Style</label>
                <select
                  value={imageBorderStyle}
                  onChange={(e) => setImageBorderStyle(e.target.value)}
                  className="w-full text-sm p-1 border border-gray-300 rounded"
                >
                  {borderStyleOptions.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Color</label>
                <select
                  value={imageBorderColor}
                  onChange={(e) => setImageBorderColor(e.target.value)}
                  className="w-full text-sm p-1 border border-gray-300 rounded"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Active Overlays</h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {overlays.map((overlay) => (
            <div key={overlay.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
              <div>
                <div className="font-medium">
                  {overlay.type === 'text' ? `Text: ${(overlay as TextOverlay).text.substring(0, 20)}${(overlay as TextOverlay).text.length > 20 ? '...' : ''}` : 'Image'}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(overlay.startTime)} - {formatTime(overlay.endTime)}
                </div>
              </div>
              <button
                className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                onClick={() => handleRemoveOverlay(overlay.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          ))}
          
          {overlays.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No overlays added yet
            </div>
          )}
        </div>
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

export default OverlayEditor