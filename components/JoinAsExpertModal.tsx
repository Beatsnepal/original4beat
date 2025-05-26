
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface JoinAsExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinAsExpertModal: React.FC<JoinAsExpertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    price: '',
    deliveryTime: '',
    sampleLink1: '',
    sampleLink2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-blue-900">Join as Expert</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
              { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (123) 456-7890' },
              { id: 'experience', label: 'Years of Experience', type: 'number', placeholder: '5' },
              { id: 'price', label: 'Price per Track (USD)', type: 'number', placeholder: '150' },
              { id: 'deliveryTime', label: 'Delivery Time (days)', type: 'number', placeholder: '3' },
              { id: 'sampleLink1', label: 'YouTube Sample Link 1', type: 'url', placeholder: 'https://youtube.com/watch?v=example1' },
              { id: 'sampleLink2', label: 'YouTube Sample Link 2', type: 'url', placeholder: 'https://youtube.com/watch?v=example2' },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-blue-900 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={(formData as any)[field.id]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={field.placeholder}
                  min={field.type === 'number' ? 1 : undefined}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-sm hover:shadow transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinAsExpertModal;
