'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BeatCard from '@/components/BeatCard';
import ExpertCard from '@/components/ExpertCardDisplay';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
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

interface Expert {
  id: string;
  name: string;
  userId: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const sessionUser: User | null = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        profileImage: null,
      };

      if (!sessionUser) {
        setIsLoading(false);
        return;
      }

      setUser(sessionUser);
      setNameInput(sessionUser.name);

      const allBeats: Beat[] = [
        {
          id: 1,
          name: 'Dream Flow',
          key: 'C#m',
          bpm: 140,
          price: 1500,
          phone: '1234567890',
          uploader: 'John Doe',
          coverArt: 'https://via.placeholder.com/150',
          audioUrl: '/audio/dream-flow.mp3',
          producerPhone: '1234567890',
        },
        {
          id: 2,
          name: 'Ocean Bounce',
          key: 'F#',
          bpm: 128,
          price: 1800,
          phone: '9999999999',
          uploader: 'Jane Smith',
          coverArt: 'https://via.placeholder.com/150',
          audioUrl: '/audio/ocean-bounce.mp3',
          producerPhone: '9999999999',
        },
      ];

      const allExperts: Expert[] = [
        {
          id: 'e1',
          name: 'Mixing Pro',
          userId: 'user-123',
          experience: '5',
          price: '2000',
          delivery_time: '2 days',
          phone: '1234567890',
          youtube1: 'https://youtube.com/sample1',
          youtube2: 'https://youtube.com/sample2'
        },
        {
          id: 'e2',
          name: 'Mastering Wizard',
          userId: 'user-456',
          experience: '7',
          price: '2500',
          delivery_time: '3 days',
          phone: '9876543210',
          youtube1: 'https://youtube.com/sample3',
          youtube2: 'https://youtube.com/sample4'
        },
      ];

      const userBeats = allBeats.filter((b) => b.phone === sessionUser.phone);
      const userExperts = allExperts.filter((e) => e.userId === sessionUser.id);

      setBeats(userBeats);
      setExperts(userExperts);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/signin';
    }
  }, [isLoading, user]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImagePreview(imageUrl);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name: nameInput, profileImage: profileImagePreview });
      alert('Profile saved!');
    }
  };

  return (
    <>
      <Navbar onUploadClick={() => {}} />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 animate-pulse"></div>
              <div className="w-48 h-8 bg-blue-100 rounded animate-pulse"></div>
              <div className="w-72 h-4 bg-blue-100 rounded animate-pulse mt-2"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md mb-12">
                <div className="flex items-center gap-6">
                  <div>
                    {profileImagePreview || user?.profileImage ? (
                      <img
                        src={profileImagePreview || user?.profileImage || ''}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleProfileImageChange} className="mt-2 text-sm" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="text-xl font-bold text-blue-900 border-b border-blue-300 w-full mb-2 outline-none"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                    />
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Save Profile
                  </button>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Your Beats</h2>
                {beats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {beats.map((beat) => (
                      <BeatCard key={beat.id} beat={beat} />
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-500">You haven’t uploaded any beats yet.</p>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Your Services</h2>
                {experts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {experts.map((expert) => (
                      <ExpertCard key={expert.id} expert={expert} />
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-500">You haven’t listed any services yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
