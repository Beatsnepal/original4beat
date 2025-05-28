'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
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

export default function AdminDashboard() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      const { data } = await supabase.from('experts').select('*');
      setExperts(data || []);
      setLoading(false);
    };

    fetchExperts();
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
    </div>
  );
}
