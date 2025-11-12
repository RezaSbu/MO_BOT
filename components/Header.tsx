import React from 'react';
import { SparklesIcon, MenuIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-center relative">
        <button onClick={onMenuClick} className="lg:hidden absolute left-0 text-gray-400 hover:text-white">
            <MenuIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center">
            <SparklesIcon className="w-7 h-7 text-blue-400 mr-3" />
            <h1 className="text-xl font-bold text-gray-100 tracking-wider">Mo_Bot</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;