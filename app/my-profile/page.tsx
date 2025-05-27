
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BeatCard from '@/components/BeatCard';
import ExpertCardDisplay from '@/components/cards/ExpertCardDisplay';
import EditExpertModal from '@/components/EditExpertModal';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [beats, setBeats] = useState([]);
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditExpertOpen, setIsEditExpertOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const userInfo = session?.user;

      if (!userInfo) {
        setIsLoading(false);
        return;
      }

      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        phone: userInfo.phone || '',
        name: '',
        profileImage: null
      };

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userInfo.id)
        .single();

      if (profileData) {
        userData.name = profileData.name;
        userData.profileImage = profileData.profile_image;
      }

      setUser(userData);

      const { data: beatsData } = await supabase.from('beats').select('*').eq('phone', userInfo.phone);
      const { data: expertData } = await supabase.from('experts').select('*').eq('user_id', userInfo.id);

      setBeats(beatsData || []);
      setExperts(expertData || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteExpert = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this service?');
    if (!confirmed) return;

    const { error } = await supabase.from('experts').delete().eq('id', id);
    if (!error) {
      setExperts((prev) => prev.filter((e) => e.id !== id));
      alert('Deleted');
    }
  };

  const handleEditExpert = (id) => {
    const expert = experts.find((e) => e.id === id);
    if (expert) {
      setSelectedExpert(expert);
      setIsEditExpertOpen(true);
    }
  };

  return (
    <>
      <Navbar onUploadClick={() => {}} />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md mb-8">
                <p className="text-blue-900 text-lg font-semibold">
                  Signed in as: <span className="text-blue-700">{user?.email}</span>
                </p>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Your Beats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {beats.map((beat) => (
                    <BeatCard
                      key={beat.id}
                      beat={beat}
                      onDelete={() => setBeats((prev) => prev.filter((b) => b.id !== beat.id))}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Your Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {experts.map((expert) => (
                    <ExpertCardDisplay
                      key={expert.id}
                      expert={expert}
                      isOwner={expert.user_id === user?.id}
                      onDelete={() => handleDeleteExpert(expert.id)}
                      onEdit={() => handleEditExpert(expert.id)}
                    />
                  ))}
                </div>
              </div>

              {isEditExpertOpen && selectedExpert && (
                <EditExpertModal
                  isOpen={isEditExpertOpen}
                  onClose={() => setIsEditExpertOpen(false)}
                  expert={selectedExpert}
                  onUpdate={() => window.location.reload()}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
