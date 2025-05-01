'use client'

import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { setUploadedVideo, setUploadProgress } from '@/lib/slices/videoSlice'
import { addAudioTrack } from '@/lib/slices/audioSlice'

const VideoUpload = () => {
  const dispatch = useDispatch()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgressState] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('video/')) {
      handleUpload(file)
    } else {
      alert('Please upload a valid video file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1
  })

  const handleUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgressState(0)

    // Create a URL for the video file
    const videoUrl = URL.createObjectURL(file)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgressState(prev => {
        const newProgress = prev + 10
        dispatch(setUploadProgress(newProgress))
        return newProgress
      })
    }, 300)

    // Create a video element to get metadata
    const video = document.createElement('video')
    video.src = videoUrl
    video.onloadedmetadata = () => {
      clearInterval(interval)
      setUploadProgressState(100)
      dispatch(setUploadProgress(100))
      
      // Set the uploaded video in the Redux store
      dispatch(setUploadedVideo({
        src: videoUrl,
        duration: video.duration,
        thumbnail: generateThumbnail(video)
      }))

      // Add the original audio track
      dispatch(addAudioTrack({
        id: '1',
        src: videoUrl,
        name: 'Original Audio',
        startTime: 0,
        endTime: video.duration,
        volume: 1.0,
        isMuted: false,
        type: 'original'
      }))

      setIsUploading(false)
    }

    video.onerror = () => {
      clearInterval(interval)
      setIsUploading(false)
      alert('Error loading video file')
    }
  }

  const generateThumbnail = (video: HTMLVideoElement): string => {
    // In a real app, we would generate a thumbnail from the video
    // For now, we'll just return a placeholder
    return '/placeholder-thumbnail.jpg'
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the video file here</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">Drag and drop your video file here, or click to browse</p>
              <p className="text-gray-500 text-sm">Supported formats: MP4, WebM, MOV</p>
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoUpload