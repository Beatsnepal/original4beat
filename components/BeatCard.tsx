import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Phone, MoreVertical, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { EditBeatModal } from './EditBeatModal';

interface Beat {
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
  qr_url?: string;
}

interface BeatCardProps {
  beat: Beat;
  onDelete?: () => void;
}

export const BeatCard: React.FC<BeatCardProps> = ({ beat, onDelete }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      window.dispatchEvent(new CustomEvent('beat-play', { detail: beat.id }));
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    const stopOnOtherPlay = (e: any) => {
      if (e.detail !== beat.id && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };

    window.addEventListener('beat-play', stopOnOtherPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      window.removeEventListener('beat-play', stopOnOtherPlay);
    };
  }, [beat.id]);

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

  const storedPhone = localStorage.getItem('userPhone');
  const isOwner = beat.phone === storedPhone;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative hover:shadow-xl transition-all duration-200 min-w-[200px] max-w-[200px] snap-start">
      <div className="aspect-square w-full bg-blue-100 relative">
        <img
          src={beat.coverArt}
          alt={beat.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          NPR {beat.price}
        </span>
      </div>

      <div className="p-3 flex flex-col justify-between">
        {/* Header Info */}
        <div className="flex justify-between items-start mb-1">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-blue-900 leading-tight">{beat.name}</h3>
            <p className="text-[11px] text-gray-600">{beat.uploader}</p>
            <p className="text-[11px] text-blue-700">{beat.key} • {beat.bpm} BPM</p>
          </div>

          {isOwner && (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-blue-500 hover:text-blue-700">
                <MoreVertical size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded z-10 w-24">
                  <button
                    className="block w-full text-left px-2 py-1 hover:bg-blue-100 text-[11px]"
                    onClick={() => {
                      setSelectedBeat(beat);
                      setIsEditOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-2 py-1 hover:bg-red-100 text-[11px] text-red-600"
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

        {/* 1. Play Button */}
        <div className="mt-2">
          <button
            onClick={togglePlay}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center space-x-1 shadow"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        {/* 2. Buy Button */}
        <div className="mt-2">
          <button
            onClick={() => {
              if (!beat.qr_url) {
                alert("No QR code uploaded for this beat.");
                return;
              }
              setShowCallPopup(true);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center space-x-1 shadow"
          >
            <Phone size={14} />
            <span>Buy</span>
          </button>
        </div>

        {/* 3. Audio Player */}
        <div className="mt-3 border-t pt-2 flex flex-col space-y-1">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="text-[10px] text-gray-500 flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={beat.audioUrl} hidden />

      {/* QR Code Popup */}
      {showCallPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl shadow-xl text-center relative w-11/12 max-w-sm mx-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowCallPopup(false)}
            >
              <X size={20} />
            </button>
            <p className="text-lg font-semibold mb-2">📞 Call the producer:</p>
            <a
              href={`tel:${beat.producerPhone}`}
              className="block mb-4 text-xl font-bold text-blue-700 underline"
            >
              {beat.producerPhone}
            </a>
            {beat.qr_url ? (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Scan QR to pay or save contact:
                </p>
                <img
                  src={beat.qr_url}
                  alt="QR Code"
                  className="mx-auto w-36 h-36 rounded-lg shadow-md"
                />
              </>
            ) : (
              <p className="text-sm text-red-500 mt-4">No QR code uploaded.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedBeat && (
        <EditBeatModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          beat={selectedBeat}
          onUpdate={onDelete}
        />
      )}
    </div>
  );
};
