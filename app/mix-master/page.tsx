
'use client';
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

interface Expert {
  id?: number;
  user_id?: string;
  name: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
}

export default function MixMasterPage() {
  const [showForm, setShowForm] = useState(false);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [formData, setFormData] = useState<Expert>({
    name: '',
    experience: '',
    price: '',
    delivery_time: '3 days',
    phone: '',
    youtube1: '',
    youtube2: '',
  });

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    const { data, error } = await supabase.from('experts').select('*').order('created_at', { ascending: false });
    if (!error && data) setExperts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      alert("You must be logged in to submit.");
      return;
    }

    const expertWithUser = { ...formData, user_id: user.id };

    const { error } = await supabase.from('experts').insert([expertWithUser]);
    if (error) {
      alert("Failed to submit: " + error.message);
    } else {
      alert("Submission successful!");
      setFormData({
        name: '',
        experience: '',
        price: '',
        delivery_time: '3 days',
        phone: '',
        youtube1: '',
        youtube2: '',
      });
      setShowForm(false);
      fetchExperts();
    }
  };

  return (
    <>
      <Navbar onUploadClick={() => {}} />
      <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">Mix and Master</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded shadow"
          >
            Join as Expert
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Join as Mixing & Mastering Expert</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input type="text" placeholder="Experience (e.g., 3 years)" className="w-full px-4 py-2 border rounded" required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
                <input type="text" placeholder="Price in NPR" className="w-full px-4 py-2 border rounded" required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <select className="w-full px-4 py-2 border rounded"
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                >
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>5 days</option>
                  <option>7 days</option>
                </select>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2 border rounded" required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input type="url" placeholder="Sample Work YouTube Link 1" className="w-full px-4 py-2 border rounded"
                  value={formData.youtube1}
                  onChange={(e) => setFormData({ ...formData, youtube1: e.target.value })}
                />
                <input type="url" placeholder="Sample Work YouTube Link 2" className="w-full px-4 py-2 border rounded"
                  value={formData.youtube2}
                  onChange={(e) => setFormData({ ...formData, youtube2: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <div key={expert.id} className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-blue-900 mb-1 tracking-tight">{expert.name}</h3>
                <p className="text-sm text-gray-600 mb-1">🎧 <strong>Experience:</strong> {expert.experience} years</p>
                <p className="text-sm text-gray-600 mb-1">💰 <strong>Price:</strong> NPR {expert.price}</p>
                <p className="text-sm text-gray-600 mb-3">⏱️ <strong>Delivery:</strong> {expert.delivery_time}</p>
                <div className="mb-4 space-y-2">
                  <a href={expert.youtube1} target="_blank" className="inline-block text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium transition">
                    ▶ Sample Link 1
                  </a>
                  <a href={expert.youtube2} target="_blank" className="inline-block text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium transition ml-2">
                    ▶ Sample Link 2
                  </a>
                </div>
              </div>
              <button
                onClick={() => alert(`📞 Call this expert at: ${expert.phone}`)}
                className="mt-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold py-2 rounded-lg shadow-md transition duration-200"
              >
                📞 Call This Expert
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
