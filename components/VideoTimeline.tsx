'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RootState } from '@/lib/store'
import { VideoSegment, updateSegment, removeSegment, reorderSegments } from '@/lib/slices/videoSlice'

// Timeline segment component
const TimelineSegment = ({ segment, index, moveSegment }: { 
  segment: VideoSegment; 
  index: number;
  moveSegment: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const dispatch = useDispatch()
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'segment',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  
  const [, drop] = useDrop(() => ({
    accept: 'segment',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSegment(item.index, index)
        item.index = index
      }
    },
  }))
  
  const handleClick = () => {
    setSelectedSegment(segment.id)
  }
  
  const handleDelete = () => {
    dispatch(removeSegment(segment.id))
  }
  
  const duration = segment.endTime - segment.startTime
  
  return (
    <div 
    ref={(node) => { drag(drop(node)); }}
      className={`timeline-segment ${selectedSegment === segment.id ? 'selected' : ''}`}
      style={{ 
        width: `${duration * 50}px`,
        opacity: isDragging ? 0.5 : 1,
      }}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center h-full px-2">
        <span className="text-xs font-medium truncate">{`Segment ${index + 1}`}</span>
        <button 
          className="text-red-500 hover:text-red-700"
          onClick={handleDelete}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

const VideoTimeline = () => {
  const dispatch = useDispatch()
  const { segments, uploadedVideo } = useSelector((state: RootState) => state.video)
  
  const moveSegment = (dragIndex: number, hoverIndex: number) => {
    const newSegments = [...segments]
    const draggedSegment = newSegments[dragIndex]
    
    // Remove the dragged segment
    newSegments.splice(dragIndex, 1)
    
    // Insert it at the new position
    newSegments.splice(hoverIndex, 0, draggedSegment)
    
    dispatch(reorderSegments(newSegments))
  }
  
  const handleAddSegment = () => {
    if (!uploadedVideo) return
    
    // For simplicity, we'll just add a new segment at the end
    // In a real app, you'd want to split the video at the current time
    const lastSegment = segments[segments.length - 1]
    const newSegment: VideoSegment = {
      id: Date.now().toString(),
      startTime: lastSegment.endTime,
      endTime: Math.min(lastSegment.endTime + 5, uploadedVideo.duration),
      src: uploadedVideo.src,
      thumbnail: uploadedVideo.thumbnail,
    }
    
    dispatch(updateSegment({
      id: lastSegment.id,
      changes: { endTime: newSegment.startTime }
    }))
    
    // In a real app, you'd add the new segment to the store
    // For now, we'll just simulate it by reordering
    dispatch(reorderSegments([...segments, newSegment]))
  }
  
  if (!uploadedVideo) {
    return <div>No video loaded</div>
  }
  
  return (
    <div className="video-timeline">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Video Timeline</h3>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={handleAddSegment}
        >
          Add Segment
        </button>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <div className="timeline-track overflow-x-auto whitespace-nowrap p-2">
          {segments.map((segment, index) => (
            <TimelineSegment
              key={segment.id}
              segment={segment}
              index={index}
              moveSegment={moveSegment}
            />
          ))}
        </div>
      </DndProvider>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Timeline Controls</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Split at Current Time
          </button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Merge Selected
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoTimeline
