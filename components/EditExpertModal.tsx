
'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Expert {
  id: string;
  name: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
}

interface EditExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert;
  onUpdate?: () => void;
}

const EditExpertModal: React.FC<EditExpertModalProps> = ({ isOpen, onClose, expert, onUpdate }) => {
  const [formData, setFormData] = useState<Expert>(expert);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('experts')
      .update(formData)
      .eq('id', expert.id);

    if (error) {
      alert('Failed to update service: ' + error.message);
    } else {
      alert('Service updated!');
      onUpdate?.();
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Edit Service</h2>

        {['name', 'experience', 'price', 'delivery_time', 'phone', 'youtube1', 'youtube2'].map((field) => (
          <input
            key={field}
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            placeholder={field.replace('_', ' ')}
            className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpertModal;
