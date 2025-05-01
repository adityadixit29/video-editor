# Video Editor Platform

A web-based video editing platform built with Next.js, React, Tailwind CSS, and Redux Toolkit.

## Features

- **Video Upload**: Drag-and-drop interface for uploading video files
- **Video Timeline**: Rearrange and edit video segments
- **Audio Management**: Control audio tracks, add background music
- **Subtitles & Text Overlay**: Add and customize subtitles and text overlays
- **Image Overlay**: Add images with customizable properties
- **Preview & Render**: Real-time preview and simulated rendering

## Tech Stack

- **Next.js** with App Router
- **React.js**
- **Tailwind CSS**
- **Redux Toolkit** for state management
- **React Player** for video playback
- **React Dropzone** for drag-and-drop uploads
- **React DnD** for drag-and-drop timeline editing

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/video-editor-platform.git
cd video-editor-platform
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: React components for the video editor
- `/lib`: Redux store and slices
- `/public`: Static assets

## Usage

1. Upload a video file using the drag-and-drop interface
2. Use the timeline to rearrange video segments
3. Add audio tracks, subtitles, and overlays
4. Preview your edits in real-time
5. Render and download the final video

## Notes

This is a frontend-only implementation. In a real-world application, the rendering and processing would be handled by a backend service.
