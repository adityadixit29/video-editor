'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import VideoUpload from './VideoUpload'
import VideoPreview from './VideoPreview'
import VideoTimeline from './VideoTimeline'
import AudioManager from './AudioManager'
import SubtitleEditor from './SubtitleEditor'
import OverlayEditor from './OverlayEditor'
import RenderControls from './RenderControls'

const VideoEditor = () => {
  const [activeTab, setActiveTab] = useState('timeline')
  const uploadedVideo = useSelector((state: RootState) => state.video.uploadedVideo)

  return (
    <div className="flex flex-col gap-6">
      {!uploadedVideo ? (
        <VideoUpload />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPreview />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 ${activeTab === 'timeline' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  Timeline
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'audio' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('audio')}
                >
                  Audio
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'subtitles' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('subtitles')}
                >
                  Subtitles
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'overlays' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('overlays')}
                >
                  Overlays
                </button>
              </div>

              <div className="h-[400px] overflow-y-auto">
                {activeTab === 'timeline' && <VideoTimeline />}
                {activeTab === 'audio' && <AudioManager />}
                {activeTab === 'subtitles' && <SubtitleEditor />}
                {activeTab === 'overlays' && <OverlayEditor />}
              </div>
            </div>
          </div>

          <RenderControls />
        </>
      )}
    </div>
  )
}

export default VideoEditor