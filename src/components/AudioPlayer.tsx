import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  }

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="mt-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            const audio = audioRef.current
            if (audio) {
              audio.currentTime = Number(e.target.value)
              setCurrentTime(audio.currentTime)
            }
          }}
          className="w-full mx-2"
        />
        <span className="text-sm">{formatTime(duration)}</span>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={() => handleSkip(-10)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={() => handleSkip(10)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <SkipForward size={20} />
        </button>
        <button onClick={toggleMute} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer