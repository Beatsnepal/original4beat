import React from 'react';
import { User } from '@/lib/types';

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <h2 className="text-2xl font-bold text-blue-900">Welcome, {user.name || user.email}</h2>
    </div>
  );
};

export default UserProfile;