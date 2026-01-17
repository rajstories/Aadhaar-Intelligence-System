import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  onViewChange?: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange }) => {
  return (
    <header className="fixed top-0 w-full h-16 bg-white shadow-sm z-50 flex flex-col justify-center border-b border-gray-200">
      <div className="flex items-center justify-between px-6 w-full">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
           {/* Logo Icon */}
          <div className="h-9 w-9 bg-navy-900 rounded-full flex items-center justify-center">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_India_logo.svg/1200px-Government_of_India_logo.svg.png" alt="Emblem" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-base leading-tight">
              Aadhaar Intelligence System
            </h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
              UIDAI Analytics Dashboard
            </p>
          </div>
        </div>
        
        {/* Center: Search - Pill Shape */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Search states, districts, alerts..."
              className="w-full px-5 py-2.5 pl-11 rounded-full bg-white 
                         border border-gray-300 text-gray-700 text-sm
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {/* Right: User Profile */}
        <div className="flex items-center gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="h-9 w-9 bg-navy-800 rounded-full flex 
                            items-center justify-center text-white font-bold shadow-sm bg-[#0f2942]">
              AA
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-bold text-sm text-gray-900 leading-none">Admin User</p>
              <p className="text-xs text-gray-500 leading-none mt-1">Central Officer</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default Header;
