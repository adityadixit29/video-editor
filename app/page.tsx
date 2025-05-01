'use client'

import { useState } from 'react'
import VideoEditor from '@/components/VideoEditor'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Video Editor Platform</h1>
      <VideoEditor />
    </main>
  )
}