'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BeatCard from '@/components/BeatCard';
import ExpertCardDisplay from '@/components/cards/ExpertCardDisplay';

interface Expert {
  id?: number;
  name: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
  user_id?: string;
}

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
}

export default function AdminDashboard() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [beats, setBeats] = useState<Beat[]>([]);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      const { data } = await supabase.from('experts').select('*');
      setExperts(data || []);
      setLoading(false);
    };

    fetchExperts();

    const fetchBeats = async () => {
      const { data } = await supabase.from('beats').select('*');
      setBeats(data || []);
    };
    fetchBeats();
  }, []);

  const handleDeleteExpert = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this expert?');
    if (!confirmed) return;

    const { error } = await supabase.from('experts').delete().eq('id', id);
    if (!error) {
      setExperts((prev) => prev.filter((e) => e.id !== id));
      alert('Deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {loading ? (
        <div className="text-center">Loading experts...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {experts.map((expert) => (
            <div key={expert.id} className="relative">
              <ExpertCardDisplay
                expert={expert}
                isOwner={false}
                onDelete={() => {}}
                onEdit={() => {}}
              />
              <button
                onClick={() => handleDeleteExpert(expert.id!)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">Uploaded Beats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {beats.map((beat) => (
          <div key={beat.id} className="relative">
            <BeatCard beat={beat} onDelete={async () => {
              const confirmDelete = window.confirm('Delete this beat?');
              if (!confirmDelete) return;
              const { error } = await supabase.from('beats').delete().eq('id', beat.id);
              if (!error) {
                setBeats((prev) => prev.filter((b) => b.id !== beat.id));
                alert('Beat deleted');
              }
            }} showCopyLink={false} />
          </div>
        ))}
      </div>
</div>
  );
}
