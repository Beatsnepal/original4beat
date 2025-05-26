
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ExpertCardDisplay from "@/components/ExpertCardDisplay";

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [beats, setBeats] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || "");
      if (user?.email === "beatsnepal74@gmail.com") {
        fetchData();
      }
    };
    fetchUser();
  }, []);

  const fetchData = async () => {
    const { data: beatsData } = await supabase.from("beats").select("*");
    const { data: engineerData } = await supabase.from("experts").select("*");
    const { data: albumData } = await supabase.from("albums").select("*");

    setBeats(beatsData || []);

    const mappedEngineers = (engineerData || []).map((eng) => ({
      id: eng.id,
      name: eng.name,
      experience: eng.experience,
      price: eng.price || "",
      delivery_time: eng.delivery_time || "",
      phone: eng.phone || "",
      youtube1: eng.youtube1 || "",
      youtube2: eng.youtube2 || "",
    }));

    setEngineers(mappedEngineers);
    setAlbums(albumData || []);
  };

  const deleteFile = async (bucket, path) => {
    if (!path) return;
    await supabase.storage.from(bucket).remove([path]);
  };

  const handleDelete = async (table, id, filePath, bucket) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error && filePath && bucket) await deleteFile(bucket, filePath);
    fetchData();
  };

  if (userEmail !== "beatsnepal74@gmail.com") {
    return <div className="p-4 text-red-500">Access denied: Admins only</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Beats</h2>
      {beats.map((beat) => (
        <div key={beat.id} className="border p-3 rounded mb-2">
          <p><strong>{beat.name}</strong> ({beat.bpm} BPM - {beat.key})</p>
          <button
            className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
            onClick={() => handleDelete("beats", beat.id, beat.audio_path, "beats")}
          >Delete</button>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-10 mb-1 text-blue-900">Mix and Master</h2>
      <p className="text-sm text-gray-600 mb-6">
        Connect with professional audio engineers to elevate your music to industry standards.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {engineers.map((eng) => (
          <div key={eng.id} className="relative">
            <ExpertCardDisplay expert={eng} />
            <button
              onClick={() => handleDelete("experts", eng.id)}
              className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700 shadow"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">Albums</h2>
      {albums.map((album) => (
        <div key={album.id} className="border p-3 rounded mb-2">
          <p><strong>{album.name}</strong> by {album.artist}</p>
          <button
            className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
            onClick={() => handleDelete("albums", album.id)}
          >Delete</button>
        </div>
      ))}
    </div>
  );
}
