import React, { useState, useRef, useEffect } from 'react';
import { Play as PlayIcon, Pause as PauseIcon, Phone, Link, Trash2 } from 'lucide-react';

export interface Beat {
  id: number;
  name: string;
  key: string;
  bpm: number;
  price: number;
  phone: string;
  uploader: string;
  coverArt: string;
  audioUrl: string;
  producerPhone: string;
}

export interface BeatCardProps {
  beat: Beat;
  showCopyLink?: boolean;
  onDelete?: () => void | Promise<void>; // ✅ Added
}

let currentPlayingAudio: HTMLAudioElement | null = null;
let currentSetIsPlaying: ((playing: boolean) => void) | null = null;

const BeatCard: React.FC<BeatCardProps> = ({ beat, showCopyLink = true, onDelete }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      if (currentPlayingAudio && currentPlayingAudio !== audioRef.current) {
        currentPlayingAudio.pause();
        if (currentSetIsPlaying) currentSetIsPlaying(false);
      }

      audioRef.current.play();
      setIsPlaying(true);
      currentPlayingAudio = audioRef.current;
      currentSetIsPlaying = setIsPlaying;
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      if (currentPlayingAudio === audioRef.current) {
        currentPlayingAudio = null;
        currentSetIsPlaying = null;
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/beat/${beat.id}`;
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow-md text-gray-800 flex flex-row overflow-hidden">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
        <img
          src={beat.coverArt}
          alt={beat.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={togglePlay}
          className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow-md"
        >
          {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>
      </div>

      <div className="flex-1 p-4 space-y-1">
        <h3 className="text-base font-semibold truncate text-gray-900">{beat.name}</h3>
        <p className="text-sm text-gray-600 truncate">{beat.uploader}</p>
        <p className="text-xs text-gray-500 truncate">{beat.key} • {beat.bpm} BPM</p>

        <div className="flex flex-wrap gap-2 pt-3 items-center">
          <span className="text-sm font-semibold bg-red-600 text-white px-3 py-1 rounded-full whitespace-nowrap">NPR {beat.price.toFixed(2)}</span>
          <button
            onClick={() => window.open(`tel:${beat.producerPhone}`, '_self')}
            className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full"
          >
            <Phone size={14} /> Buy
          </button>

          {showCopyLink && (
            <button
              onClick={handleCopyLink}
              title={copySuccess ? 'Link copied!' : 'Copy link'}
              className={`p-1.5 rounded-full ${copySuccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Link size={14} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={beat.audioUrl}
        onEnded={() => {
          setIsPlaying(false);
          if (currentPlayingAudio === audioRef.current) {
            currentPlayingAudio = null;
            currentSetIsPlaying = null;
          }
        }}
        hidden
      />
    </div>
  );
};

export default BeatCard;
