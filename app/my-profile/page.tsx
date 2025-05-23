
'use client';
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

interface Expert {
  id: number;
  user_id: string;
  name: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (!currentUser) {
        window.location.href = "/signin";
        return;
      }

      setUser(currentUser);
      await fetchExperts(currentUser.id);
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchExperts = async (userId: string) => {
    const { data, error } = await supabase
      .from('experts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) setExperts(data);
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this expert?");
    if (!confirm) return;

    const { error } = await supabase.from('experts').delete().eq('id', id);
    if (!error && user) {
      await fetchExperts(user.id);
    }
  };

  return (
    <>
      <Navbar onUploadClick={() => {}} />
      <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">My Profile</h1>

          {loading ? (
            <p className="text-blue-500">Loading...</p>
          ) : experts.length === 0 ? (
            <p className="text-blue-500">You haven't uploaded any experts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <div key={expert.id} className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-1">{expert.name}</h3>
                    <p className="text-sm text-gray-700 mb-1">🎧 <strong>Experience:</strong> {expert.experience} years</p>
                    <p className="text-sm text-gray-700 mb-1">💰 <strong>Price:</strong> NPR {expert.price}</p>
                    <p className="text-sm text-gray-700 mb-2">⏱️ <strong>Delivery:</strong> {expert.delivery_time}</p>
                    <div className="mb-3 space-y-1">
                      <a href={expert.youtube1} target="_blank" className="text-blue-600 text-sm underline block">▶ Sample Link 1</a>
                      <a href={expert.youtube2} target="_blank" className="text-blue-600 text-sm underline block">▶ Sample Link 2</a>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleDelete(expert.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => alert('Edit functionality coming soon')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
