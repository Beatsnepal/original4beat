
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import BeatCard from '../../components/BeatCard';

export default function BeatPage() {
  const router = useRouter();
  const { id } = router.query;
  const [beat, setBeat] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data, error } = await supabase
        .from('beats')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setBeat(data);
      } else {
        console.error('Error fetching beat:', error);
      }
    })();
  }, [id]);

  if (!beat) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Beat not found or loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <BeatCard
          beat={{
            id: beat.id,
            name: beat.name,
            key: beat.key,
            bpm: beat.bpm,
            price: beat.price,
            phone: beat.phone,
            uploader: beat.uploader,
            coverArt: beat.cover_url,
            audioUrl: beat.audio_url,
            producerPhone: beat.phone,
          }}
          showCopyLink={true}
        />
      </div>
    </div>
  );
}
