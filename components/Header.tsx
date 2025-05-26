import React from 'react';
import { Music } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            AudioPro
          </span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                className="text-blue-900 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-blue-600 border-b-2 border-blue-600 font-medium"
              >
                Mix & Master
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-blue-900 hover:text-blue-600 transition-colors font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-blue-900 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;