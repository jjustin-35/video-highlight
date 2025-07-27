"use client"

interface TranscriptOverlayProps {
  text: string
  isVisible: boolean
}

export function TranscriptOverlay({ text, isVisible }: TranscriptOverlayProps) {
  if (!isVisible || !text) return null

  return (
    <div className="absolute bottom-20 left-4 right-4 flex justify-center">
      <div className="bg-black/80 text-white px-4 py-2 rounded-lg max-w-2xl text-center">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
