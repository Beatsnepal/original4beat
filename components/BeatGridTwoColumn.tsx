
import React from 'react';
import BeatCard, { Beat } from './BeatCard';

interface BeatGridTwoColumnProps {
  beats: Beat[];
}

const BeatGridTwoColumn: React.FC<BeatGridTwoColumnProps> = ({ beats }) => {
  const half = Math.ceil(beats.length / 2);
  const leftBeats = beats.slice(0, half);
  const rightBeats = beats.slice(half);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6 w-full">
      <div className="space-y-6">
        {leftBeats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>
      <div className="space-y-6">
        {rightBeats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>
    </div>
  );
};

export default BeatGridTwoColumn;
