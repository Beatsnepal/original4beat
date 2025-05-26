
'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import ExpertCardDisplay from '@/components/cards/ExpertCardDisplay';

type Expert = {
  id: number;
  name: string;
  experience: string;
  price: number;
  sample1: string;
  sample2: string;
  sample3: string;
  phone: string;
};

type Album = {
  id: number;
  title: string;
  artist: string;
  price: number;
  track1_url: string;
  track2_url: string;
  track3_url: string;
  qr_code_url: string;
  phone: string;
};

export default function DashboardPage() {
  // const supabase = createClient();  // Replaced with direct import
  const supabase = supabase;
  const [engineers, setEngineers] = useState<Expert[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: engineerData } = await supabase.from('experts').select('*');
      const { data: albumData } = await supabase.from('albums').select('*');

      const mappedEngineers: Expert[] = (engineerData || []).map((eng) => ({
        id: parseInt(eng.id), // Convert to number
        name: eng.name,
        experience: eng.experience,
        price: eng.price,
        sample1: eng.sample1,
        sample2: eng.sample2,
        sample3: eng.sample3,
        phone: eng.phone,
      }));

      setEngineers(mappedEngineers);
      setAlbums(albumData || []);
    };

    fetchData();
  }, []);

  const handleDelete = async (table: string, id: number) => {
    await supabase.from(table).delete().eq('id', id);
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Mixing & Mastering Engineers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {engineers.map((eng) => (
          <div key={eng.id} className="relative">
            <ExpertCardDisplay expert={eng} />
            <button
              onClick={() => handleDelete('experts', eng.id)}
              className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700 shadow"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div key={album.id} className="border p-4 rounded shadow relative">
            <h3 className="font-bold">{album.title}</h3>
            <p>By: {album.artist}</p>
            <p>Price: Rs. {album.price}</p>
            <audio controls src={album.track1_url} className="w-full mt-2" />
            <audio controls src={album.track2_url} className="w-full mt-2" />
            <audio controls src={album.track3_url} className="w-full mt-2" />
            <img src={album.qr_code_url} alt="QR Code" className="w-32 h-32 mt-2" />
            <p className="mt-2">Phone: <a href={`tel:${album.phone}`} className="text-blue-600">{album.phone}</a></p>
            <button
              onClick={() => handleDelete('albums', album.id)}
              className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700 shadow"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
