'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { startRendering, updateRenderProgress, completeRendering } from '@/lib/slices/videoSlice'

const RenderControls = () => {
  const dispatch = useDispatch()
  const { isRendering, renderProgress } = useSelector((state: RootState) => state.video)
  const [renderQuality, setRenderQuality] = useState('1080p')
  const [renderFormat, setRenderFormat] = useState('mp4')
  
  const handleRender = () => {
    dispatch(startRendering())
    
    // Simulate rendering process
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      dispatch(updateRenderProgress(progress))
      
      if (progress >= 100) {
        clearInterval(interval)
        dispatch(completeRendering())
      }
    }, 300)
  }
  
  const handleDownload = () => {
    // In a real app, this would download the rendered video
    // For now, we'll just show an alert
    alert('Video download would start here in a real application')
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Render & Export</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
          <select
            value={renderQuality}
            onChange={(e) => setRenderQuality(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p (Full HD)</option>
            <option value="2160p">2160p (4K)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select
            value={renderFormat}
            onChange={(e) => setRenderFormat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="mp4">MP4 (H.264)</option>
            <option value="webm">WebM (VP9)</option>
            <option value="mov">MOV (QuickTime)</option>
          </select>
        </div>
      </div>
      
      {isRendering ? (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Rendering...</span>
            <span>{renderProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${renderProgress}%` }}
            ></div>
          </div>
        </div>
      ) : renderProgress === 100 ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download Video
          </button>
          <button
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleRender}
          >
            Render Again
          </button>
        </div>
      ) : (
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          onClick={handleRender}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Render Video
        </button>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Estimated file size: {renderQuality === '1080p' ? '~120MB' : renderQuality === '720p' ? '~60MB' : renderQuality === '480p' ? '~30MB' : '~240MB'}</p>
        <p>Note: This is a frontend demo. No actual rendering will occur.</p>
      </div>
    </div>
  )
}

export default RenderControls