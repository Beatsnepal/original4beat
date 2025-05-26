
'use client';
import React, { useEffect, useState } from 'react';
import { Menu, X, Music } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface NavbarProps {
  onUploadClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onUploadClick }) => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user && user.email === 'beatsnepal74@gmail.com';

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music size={28} className="text-white" />
          <span className="font-bold text-xl tracking-tight">Beats 4 Nepal</span>
        </div>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <a href="#beats" className="hover:text-blue-200 transition-colors">Beats</a>
          <Link href="/mix-master" className="hover:text-blue-200 transition-colors">Mix and Master</Link>
          <Link href="/album-sell" className="hover:text-blue-200 transition-colors">Albums</Link>
          <Link href="/my-profile" className="hover:text-blue-200 transition-colors">My Profile</Link>
          {user !== null && isAdmin && (
            <Link href="/admin/dashboard" className="hover:text-yellow-300 transition-colors">
              Admin
            </Link>
          )}
          {!user && (
            <>
              <Link href="/signup" className="hover:text-blue-200 transition-colors">Sign Up</Link>
              <Link href="/signin" className="hover:text-blue-200 transition-colors">Sign In</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="hover:text-red-300 transition-colors">
              Logout
            </button>
          )}
          {user && (
            <button
              onClick={onUploadClick}
              className="bg-white text-blue-900 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors"
            >
              Upload Beat
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-4 pb-4">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <a href="#beats" onClick={() => setMenuOpen(false)}>Beats</a>
          <Link href="/mix-master" onClick={() => setMenuOpen(false)}>Mix and Master</Link>
          <Link href="/album-sell" onClick={() => setMenuOpen(false)}>Albums</Link>
          <Link href="/my-profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
          {user !== null && isAdmin && (
            <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="text-yellow-300">
              Admin
            </Link>
          )}
          {!user && (
            <>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              <Link href="/signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
            </>
          )}
          {user && (
            <>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
              <button
                onClick={() => { onUploadClick(); setMenuOpen(false); }}
                className="bg-white text-blue-900 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors"
              >
                Upload Beat
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
