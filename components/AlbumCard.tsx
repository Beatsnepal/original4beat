
import { useEffect, useRef, useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

export default function AlbumCard({ album }) {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    audioRefs.current.forEach((audio, i) => {
      if (!audio) return;
      audio.onplay = () => {
        audioRefs.current.forEach((otherAudio, j) => {
          if (i !== j && otherAudio && !otherAudio.paused) {
            otherAudio.pause();
          }
        });
      };
    });
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (album.name === "Test Album" && album.artist_name === "Test Artist") return null;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all w-full max-w-sm mx-auto flex flex-col overflow-hidden">
      {/* COVER ART */}
      <div className="relative aspect-square w-full">
        <img
          src={album.cover_url || 'https://via.placeholder.com/300?text=No+Cover'}
          alt="Album Cover"
          className="object-cover w-full h-full rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl" />
      </div>

      {/* ALBUM INFO */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-blue-900 truncate">{album.name || 'Untitled Album'}</h2>
          <p className="text-sm text-gray-600 truncate">By {album.artist_name || 'Unknown Artist'}</p>
          <p className="text-green-600 font-semibold mt-1">NPR {album.price}</p>
        </div>

        {/* AUDIO PREVIEWS */}
        <div className="space-y-2">
          {[album.preview_1_url, album.preview_2_url, album.preview_3_url].map((url, idx) => (
            url && (
              <audio
                key={idx}
                ref={(el) => { if (el) audioRefs.current[idx] = el; }}
                controls
                controlsList="nodownload"
                className="w-full rounded border"
                src={url}
              />
            )
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowPopup(true)}
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            Buy Album
          </button>
          <button
            onClick={handleCopyLink}
            className="py-2.5 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            aria-label="Copy link"
          >
            {copied ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <LinkIcon size={16} />
            )}
          </button>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Contact to Purchase</h3>
            <img
              src={album.qr_code_url}
              alt="QR Code"
              className="w-40 h-40 mx-auto rounded mb-4"
            />
            <p className="text-lg text-green-700 font-semibold">📞 {album.phone_number}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
