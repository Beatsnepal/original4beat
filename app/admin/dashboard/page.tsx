'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ExpertCardDisplay from '@/components/cards/ExpertCardDisplay';

type Expert = {
  id?: number;
  name: string;
  experience: string;
  price: string;
  delivery_time: string;
  phone: string;
  youtube1: string;
  youtube2: string;
};

export default function AdminDashboard() {
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const { data, error } = await supabase.from('experts').select('*');
      if (error) {
        console.error('Error fetching experts:', error);
      } else {
        setExperts(data);
      }
    };

    fetchExperts();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {experts.map((expert) => (
        <ExpertCardDisplay key={expert.id} expert={expert} />
      ))}
    </div>
  );
}
