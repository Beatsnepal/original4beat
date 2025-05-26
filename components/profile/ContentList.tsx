import React from 'react';
import { ContentItem } from '@/lib/types';

const ContentList: React.FC<{ content: ContentItem[]; onDelete: (id: string) => void }> = ({
  content,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {content.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
          <div>
            <h3 className="text-blue-900 font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.date}</p>
          </div>
          <div className="flex gap-2">
            <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
            <button onClick={() => onDelete(item.id)} className="text-sm px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentList;