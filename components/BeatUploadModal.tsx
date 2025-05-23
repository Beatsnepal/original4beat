import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BeatUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const keys = [
  'A Minor', 'A# Minor', 'B Minor', 'C Minor', 'C# Minor', 'D Minor', 'D# Minor', 'E Minor', 'F Minor', 'F# Minor', 'G Minor', 'G# Minor',
  'A Major', 'A# Major', 'B Major', 'C Major', 'C# Major', 'D Major', 'D# Major', 'E Major', 'F Major', 'F# Major', 'G Major', 'G# Major'
];

export const BeatUploadModal: React.FC<BeatUploadModalProps> = ({ isOpen, onClose }) => {
  const [beatName, setBeatName] = useState('');
  const [key, setKey] = useState('');
  const [bpm, setBpm] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [uploader, setUploader] = useState('');
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverArt(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverArtPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!beatName || !key || !bpm || !price || !phone || !uploader || !coverArt || !mp3File) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);
    const timestamp = Date.now();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be signed in to upload a beat.");
      setLoading(false);
      return;
    }

    const { data: coverData, error: coverError } = await supabase.storage
      .from('beat-files')
      .upload(`covers/${timestamp}-${coverArt.name}`, coverArt);

    if (coverError) {
      alert('Cover art upload failed');
      setLoading(false);
      return;
    }

    const coverUrl = supabase.storage.from('beat-files').getPublicUrl(coverData.path).data.publicUrl;

    const { data: audioData, error: audioError } = await supabase.storage
      .from('beat-files')
      .upload(`beats/${timestamp}-${mp3File.name}`, mp3File);

    if (audioError) {
      alert('MP3 upload failed');
      setLoading(false);
      return;
    }

    const audioUrl = supabase.storage.from('beat-files').getPublicUrl(audioData.path).data.publicUrl;

    let qrUrl = '';
    if (qrCode) {
      const { data: qrData, error: qrError } = await supabase.storage
        .from('beat-files')
        .upload(`qrcodes/${timestamp}-${qrCode.name}`, qrCode);

      if (qrError) {
        alert('QR code upload failed');
        setLoading(false);
        return;
      }

      qrUrl = supabase.storage.from('beat-files').getPublicUrl(qrData.path).data.publicUrl;
    }

    const { error: dbError } = await supabase.from('beats').insert({
      name: beatName,
      key,
      bpm: parseInt(bpm),
      price: parseFloat(price),
      phone,
      uploader,
      cover_url: coverUrl,
      audio_url: audioUrl,
      qr_url: qrUrl,
      user_id: user.id
    });

    setLoading(false);

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
      alert('Failed to save beat. See console for details.');
    } else {
      alert('Beat uploaded successfully!');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl p-6">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Upload Beat</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Beat Name"
              className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={beatName}
              onChange={(e) => setBeatName(e.target.value)}
            />
            <input
              type="text"
              placeholder="BPM"
              className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            >
              <option value="">Key</option>
              {keys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Price (NPR)"
              className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Uploader Name"
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
          />
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">Upload Cover Art</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverArtChange}
              className="w-full"
            />
            {coverArtPreview && (
              <img src={coverArtPreview} alt="Cover Art Preview" className="mt-2 rounded-lg w-full h-auto" />
            )}
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">Upload MP3 File</label>
            <input
              type="file"
              accept="audio/mp3"
              onChange={(e) => setMp3File(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">Upload QR Code (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setQrCode(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};
