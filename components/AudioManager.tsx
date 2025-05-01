'use client'

import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { 
  AudioTrack, 
  addAudioTrack, 
  updateAudioTrack, 
  removeAudioTrack, 
  toggleMuteTrack, 
  setTrackVolume 
} from '@/lib/slices/audioSlice'

const AudioManager = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { tracks } = useSelector((state: RootState) => state.audio)
  const { uploadedVideo } = useSelector((state: RootState) => state.video)
  
  const handleAddAudio = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && uploadedVideo) {
      // Create a URL for the audio file
      const audioUrl = URL.createObjectURL(file)
      
      // Add the audio track to the Redux store
      dispatch(addAudioTrack({
        id: Date.now().toString(),
        src: audioUrl,
        name: file.name,
        startTime: 0,
        endTime: uploadedVideo.duration, // Default to full video duration
        volume: 1.0,
        isMuted: false,
        type: 'background'
      }))
    }
  }
  
  const handleVolumeChange = (id: string, volume: number) => {
    dispatch(setTrackVolume({ id, volume }))
  }
  
  const handleToggleMute = (id: string) => {
    dispatch(toggleMuteTrack(id))
  }
  
  const handleRemoveTrack = (id: string) => {
    // Don't allow removing the original audio track
    if (tracks.find(track => track.id === id)?.type !== 'original') {
      dispatch(removeAudioTrack(id))
    }
  }
  
  return (
    <div className="audio-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Audio Tracks</h3>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={handleAddAudio}
        >
          Add Audio
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        />
      </div>
      
      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">{track.name}</div>
              <div className="flex items-center gap-2">
                <button
                  className={`p-1 rounded ${track.isMuted ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}
                  onClick={() => handleToggleMute(track.id)}
                >
                  {track.isMuted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                    </svg>
                  )}
                </button>
                
                {track.type !== 'original' && (
                  <button
                    className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                    onClick={() => handleRemoveTrack(track.id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="audio-waveform mb-2"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.volume}
                onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8 text-right">{Math.round(track.volume * 100)}%</span>
            </div>
          </div>
        ))}
        
        {tracks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No audio tracks added yet
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioManager