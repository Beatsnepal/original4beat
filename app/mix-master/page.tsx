'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'; // ✅ Fixed import
import { supabase } from '@/lib/supabaseClient';
import ExpertCardDisplay from '../../components/ExpertCardDisplay';

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
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Mix and Master</h1>
          <p className="text-blue-800 mb-6">Connect with professional audio engineers to elevate your music to industry standards.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold tracking-wide transition-transform transform hover:-translate-y-1"
          >
            Join as Expert
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Become a Mixing & Mastering Expert</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input type="text" placeholder="Experience (e.g., 3 years)" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
                <input type="text" placeholder="Price in NPR" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                >
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>5 days</option>
                  <option>7 days</option>
                </select>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input type="url" placeholder="Sample Work YouTube Link 1" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.youtube1}
                  onChange={(e) => setFormData({ ...formData, youtube1: e.target.value })}
                />
                <input type="url" placeholder="Sample Work YouTube Link 2" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.youtube2}
                  onChange={(e) => setFormData({ ...formData, youtube2: e.target.value })}
                />
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {experts.map((expert) => (
            <ExpertCardDisplay key={expert.id} expert={expert} />
          ))}
        </div>
      </section>
    </>
  );
}
