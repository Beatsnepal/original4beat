
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BeatCard from '@/components/BeatCard';
import ExpertCardDisplay from '@/components/cards/ExpertCardDisplay';

type Expert = {
  id?: number;
  name: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
};

type Beat = {
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
};

export default function AdminDashboard() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [beats, setBeats] = useState<Beat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: expertData } = await supabase.from('experts').select('*');
      const { data: beatData } = await supabase.from('beats').select('*');

      if (expertData) setExperts(expertData);
      if (beatData) setBeats(beatData);
    };

    fetchData();
  }, []);

  const handleDeleteExpert = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this expert service?');
    if (!confirmed) return;

    const { error } = await supabase.from('experts').delete().eq('id', id);
    if (!error) {
      alert('Expert deleted!');
      setExperts((prev) => prev.filter((e) => e.id !== id));
    } else {
      alert('Failed to delete expert: ' + error.message);
    }
  };

  const handleDeleteBeat = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this beat?');
    if (!confirmed) return;

    const { error } = await supabase.from('beats').delete().eq('id', id);
    if (!error) {
      alert('Beat deleted!');
      setBeats((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert('Failed to delete beat: ' + error.message);
    }
  };

  return (
    <div className="p-4 space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">All Experts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <div key={expert.id} className="relative">
              <ExpertCardDisplay expert={expert} />
              <button
                onClick={() => handleDeleteExpert(expert.id!)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Beats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beats.map((beat) => (
            <div key={beat.id} className="relative">
              <BeatCard beat={beat} showCopyLink={false} />
              <button
                onClick={() => handleDeleteBeat(beat.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
