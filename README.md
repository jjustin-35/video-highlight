# Video Highlight Editor

A modern web application that enables users to upload videos and create AI-powered highlight clips with automatic transcript generation. The application provides an intuitive interface for selecting and editing video segments based on transcribed content.

## Features

### Core Functionality
- **Video Upload & Processing**: Support for multiple video formats (MP4, MOV, AVI, WebM)
- **AI-Powered Transcription**: Automatic speech-to-text conversion with precise timestamps
- **Smart Highlight Detection**: AI suggests the most important moments in your video
- **Interactive Timeline**: Visual representation of selected segments and highlights
- **Real-time Preview**: Live video playback with transcript overlay
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Interface
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Transcript Editor**: Interactive transcript with clickable timestamps
- **Video Controls**: Custom video player with play/pause, timeline scrubbing, and volume control
- **Segment Selection**: Easy selection and deselection of transcript sentences
- **Live Synchronization**: Transcript automatically scrolls to match video playback

### Technical Features
- **Client-side Processing**: Fast, secure video processing without server uploads
- **Responsive Layout**: Adaptive design for portrait and landscape orientations
- **Modern UI Components**: Clean, accessible interface built with Radix UI
- **Type Safety**: Full TypeScript implementation for robust development

## Tech Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variant management

### File Handling
- **React Dropzone** - File upload with drag & drop support

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Tailwind Merge** - Conditional class merging


## Getting Started

### Prerequisites
- Node.js 22.17.0 or higher
- yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jjustin-35/video-highlight.git
cd video-highlight
```

2. Install dependencies:
```bash
yarn install
```

### Development

1. Start the development server:
```bash
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Build the project:
```bash
yarn build
```

4. Start the production server:
```bash
yarn start
```
### Demo
The application includes a demo video (`/public/demo.mp4`) that you can use to explore the features without uploading your own content.

## Project Architecture

### Directory Structure
```
video-highlight/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── loading.tsx         # Loading component
│   └── page.tsx            # Main application page
├── components/             # Reusable UI components
│   ├── Badge/              # Status badges
│   ├── Button/             # Interactive buttons
│   ├── EditingArea/        # Transcript editing interface
│   ├── PreviewArea/        # Video preview container
│   ├── Slider/             # Range input components
│   ├── TranscriptOverlay/  # Video transcript overlay
│   ├── VideoPlayer/        # Custom video player
│   └── VideoUpload/        # File upload interface
├── contexts/               # React context providers
│   └── videoContext.tsx    # Global video state management
├── helpers/                # Utility functions
│   ├── combineClass.ts     # Class name utilities
│   └── formatTime.ts       # Time formatting helpers
├── lib/                    # External libraries and services
│   └── mockAi/             # Mock AI processing service
├── types/                  # TypeScript type definitions
│   └── video.ts            # Video-related interfaces
└── public/                 # Static assets
    └── demo.mp4            # Demo video file
```

### Component Architecture

#### Core Components
- **VideoHighlightEditor**: Main application container
- **VideoUpload**: File upload interface with drag & drop
- **EditingArea**: Transcript display and editing controls
- **PreviewArea**: Video player and preview container
- **VideoPlayer**: Custom video player with controls

#### State Management
- **VideoContext**: Centralized state management using React Context

### Data Flow
1. **File Upload**: User uploads video or selects demo
2. **Processing**: Mock AI service generates transcript with timestamps
3. **Highlight Detection**: AI suggests important segments
4. **User Interaction**: User can select/deselect transcript sentences
5. **Real-time Preview**: Selected segments are visualized on timeline
6. **Playback Sync**: Video playback synchronizes with transcript