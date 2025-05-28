import React, { useState } from 'react';
import { Clock, Award, Phone, Link2, Check, X } from 'lucide-react';

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

interface ExpertCardProps {
  expert: Expert;
  isOwner?: boolean;
  onDelete: () => void;
  onEdit: () => void;
}

const ExpertCardDisplay: React.FC<ExpertCardProps> = ({ expert, isOwner, onDelete, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-blue-900">{expert.name}</h3>
              <button
                onClick={handleCopyLink}
                className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                title="Copy link to profile"
              >
                {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center text-blue-800 mb-3">
              <Award className="h-5 w-5 mr-2 text-blue-600" />
              <span>{expert.experience} Years Experience</span>
            </div>

            <div className="flex items-center text-blue-800 mb-3">
              <span className="text-blue-600 font-bold text-lg mr-2">₹</span>
              <span>{expert.price} per track</span>
            </div>

            <div className="flex items-center text-blue-800 mb-4">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              <span>{expert.delivery_time} delivery</span>
            </div>

            <p className="text-sm font-medium text-blue-800 mb-2">Sample Work:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {expert.youtube1 && (
                <a
                  href={expert.youtube1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  <span className="mr-1">🎬</span>
                  Sample 1
                </a>
              )}
              {expert.youtube2 && (
                <a
                  href={expert.youtube2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  <span className="mr-1">🎬</span>
                  Sample 2
                </a>
              )}
            </div>

            <button
              onClick={() => setShowPopup(true)}
              className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition shadow flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call This Expert
            </button>

            {isOwner && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={onEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-red-600 text-white rounded-xl shadow-xl w-full max-w-sm p-6 relative text-center">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-2">Phone Number</h2>
            <p className="text-2xl font-bold mb-4">{expert.phone}</p>
            <a
              href={`tel:${expert.phone}`}
              className="inline-block bg-white text-red-600 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertCardDisplay;
