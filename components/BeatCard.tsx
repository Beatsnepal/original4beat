// BeatCard.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play as PlayIcon, Pause as PauseIcon, Phone, MoreVertical, X, Link } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { EditBeatModal } from './EditBeatModal';

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
  onDelete?: () => void;
  showCopyLink?: boolean;
}

let currentPlayingAudio: HTMLAudioElement | null = null;
let currentSetIsPlaying: ((playing: boolean) => void) | null = null;

const BeatCard: React.FC<BeatCardProps> = ({ beat, onDelete, showCopyLink = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this beat?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('beats').delete().eq('id', beat.id);
    if (error) {
      alert('Failed to delete beat: ' + error.message);
    } else {
      alert('Beat deleted!');
      if (onDelete) onDelete();
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

  const storedPhone = typeof window !== 'undefined' ? localStorage.getItem('userPhone') : null;
  const isOwner = beat.phone === storedPhone;
  const copyBtnClass = `p-2 rounded-full transition-colors ${copySuccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;

  return (
    <div className="flex flex-wrap items-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-all px-5 py-5 gap-4 w-full border border-blue-100">
      <img src={beat.coverArt} alt={beat.name} className="w-20 h-20 rounded-lg object-cover" />

      <div className="flex-1 min-w-[150px]">
        <h3 title={beat.name} className="font-semibold text-blue-900 text-base sm:text-lg leading-snug break-words line-clamp-2">{beat.name}</h3>
        <p className="text-sm text-gray-600 truncate">{beat.uploader}</p>
        <p className="text-sm text-blue-700 tracking-wide">{beat.key} • {beat.bpm} BPM</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-end">
        {showCopyLink && (
          <button
            onClick={handleCopyLink}
            title={copySuccess ? 'Link copied!' : 'Copy link'}
            className={copyBtnClass}
          >
            <Link size={16} />
          </button>
        )}

        <button
          onClick={togglePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1"
        >
          {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={() => setShowCallPopup(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1"
        >
          <Phone size={16} />
          <span>Buy</span>
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-sm"
          >
            Delete
          </button>
        )}

        <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold whitespace-nowrap">NPR {beat.price}</span>

        {isOwner && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-blue-500 hover:text-blue-700">
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded z-10 w-28">
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-blue-100 text-sm"
                  onClick={() => {
                    setSelectedBeat(beat);
                    setIsEditOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-red-100 text-sm text-red-600"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDelete();
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
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

      {showCallPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-center relative w-72">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-200"
              onClick={() => setShowCallPopup(false)}
            >
              <X size={20} />
            </button>
            <p className="text-lg font-semibold">📞 Call the producer:</p>
            <a
              href={`tel:${beat.producerPhone}`}
              className="block mt-4 text-xl font-bold underline"
            >
              {beat.producerPhone}
            </a>
          </div>
        </div>
      )}

      {isEditOpen && selectedBeat && (
        <EditBeatModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          beat={selectedBeat}
          onUpdate={onDelete ?? (() => {})}
        />
      )}
    </div>
  );
};

export default BeatCard;
