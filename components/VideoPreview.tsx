'use client'

import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactPlayer from 'react-player'
import { RootState } from '@/lib/store'
import { setCurrentTime, setIsPlaying } from '@/lib/slices/videoSlice'
import { Subtitle } from '@/lib/slices/subtitleSlice'
import { Overlay } from '@/lib/slices/overlaySlice'

const VideoPreview = () => {
  const dispatch = useDispatch()
  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { uploadedVideo, currentTime, isPlaying } = useSelector((state: RootState) => state.video)
  const subtitles = useSelector((state: RootState) => state.subtitle.subtitles)
  const overlays = useSelector((state: RootState) => state.overlay.overlays)
  
  // Find active subtitles and overlays based on current time
  const activeSubtitles = subtitles.filter(
    (subtitle: Subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
  )
  
  const activeOverlays = overlays.filter(
    (overlay: Overlay) => currentTime >= overlay.startTime && currentTime <= overlay.endTime
  )

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime, 'seconds')
    }
  }, [currentTime])

  const handleProgress = (state: { playedSeconds: number }) => {
    dispatch(setCurrentTime(state.playedSeconds))
  }

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying))
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !uploadedVideo) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * uploadedVideo.duration
    
    dispatch(setCurrentTime(newTime))
  }

  if (!uploadedVideo) {
    return <div>No video loaded</div>
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative" ref={containerRef}>
        <ReactPlayer
          ref={playerRef}
          url={uploadedVideo.src}
          width="100%"
          height="auto"
          playing={isPlaying}
          onProgress={handleProgress}
          onPause={() => dispatch(setIsPlaying(false))}
          onPlay={() => dispatch(setIsPlaying(true))}
          progressInterval={100}
        />
        
        {/* Overlay container */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Subtitles */}
          {activeSubtitles.map((subtitle) => (
            <div
              key={subtitle.id}
              className="absolute"
              style={{
                left: `${subtitle.position.x}%`,
                bottom: `${subtitle.position.y}%`,
                color: subtitle.color,
                fontFamily: subtitle.font,
                fontSize: `${subtitle.fontSize}px`,
                textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                maxWidth: '80%',
                textAlign: 'center',
              }}
            >
              {subtitle.text}
            </div>
          ))}
          
          {/* Text and Image Overlays */}
          {activeOverlays.map((overlay) => {
            if (overlay.type === 'text') {
              return (
                <div
                  key={overlay.id}
                  className="absolute"
                  style={{
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    color: overlay.color,
                    fontFamily: overlay.font,
                    fontSize: `${overlay.fontSize}px`,
                  }}
                >
                  {overlay.text}
                </div>
              )
            } else if (overlay.type === 'image') {
              return (
                <img
                  key={overlay.id}
                  src={overlay.src}
                  className="absolute"
                  style={{
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    width: `${overlay.size.width}px`,
                    height: `${overlay.size.height}px`,
                    opacity: overlay.opacity,
                    border: `${overlay.border.width}px ${overlay.border.style} ${overlay.border.color}`,
                  }}
                  alt="Overlay"
                />
              )
            }
            return null
          })}
        </div>
      </div>
      
      {/* Video controls */}
      <div className="bg-gray-900 p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="text-white"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </button>
          
          <div className="flex-1 cursor-pointer" onClick={handleSeek}>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${(currentTime / uploadedVideo.duration) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(uploadedVideo.duration)}
          </div>
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

export default VideoPreview