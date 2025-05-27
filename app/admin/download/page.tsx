"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

type Beat = {
  id: number;
  name: string;
  key: string;
  bpm: string;
  audio_path: string;
};

export default function AdminDownloadPage() {
  const user = useUser();
  const [beats, setBeats] = useState<Beat[]>([]);

  const isAdmin = user?.email === "beatsnepal74@gmail.com";

  useEffect(() => {
    if (isAdmin) fetchBeats();
  }, [user]);

  const fetchBeats = async () => {
    const { data, error } = await supabase.from("beats").select("*");
    if (error) {
      console.error("Failed to fetch beats:", error);
    } else {
      setBeats(data);
    }
  };

  const handleDownload = async (path: string) => {
    if (!path) return alert("No audio file found.");

    const { data, error } = await supabase
      .storage
      .from("beats")
      .createSignedUrl(path, 60);

    if (error || !data?.signedUrl) {
      console.error("Download error:", error);
      return alert("Failed to get download link.");
    }

    window.open(data.signedUrl, "_blank");
  };

  if (!user) {
    return <div className="p-6">🔒 Please log in.</div>;
  }

  if (!isAdmin) {
    return <div className="p-6 text-red-600">🚫 Access denied. Admin only.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎵 Admin Beat Downloads</h1>

      {beats.length === 0 ? (
        <p>No beats uploaded yet.</p>
      ) : (
        <div className="space-y-4">
          {beats.map((beat) => (
            <div
              key={beat.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{beat.name}</p>
                <p className="text-sm text-gray-500">
                  Key: {beat.key} | BPM: {beat.bpm}
                </p>
              </div>
              <button
                onClick={() => handleDownload(beat.audio_path)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
