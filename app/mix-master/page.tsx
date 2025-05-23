
'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';

interface Expert {
  name: string;
  experience: string;
  price: string;
  deliveryTime: string;
  phone: string;
}

export default function MixMasterPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Expert>({
    name: '',
    experience: '',
    price: '',
    deliveryTime: '3 days',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Expert submitted: ' + JSON.stringify(formData, null, 2));
    setFormData({ name: '', experience: '', price: '', deliveryTime: '3 days', phone: '' });
    setShowForm(false);
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
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Experience (e.g., 3 years)"
                  className="w-full px-4 py-2 border rounded"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Price in NPR"
                  className="w-full px-4 py-2 border rounded"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <select
                  className="w-full px-4 py-2 border rounded"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                >
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>5 days</option>
                  <option>7 days</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
