import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo with lung icon */}
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-8 h-8 text-primary-500"
            >
              <path d="M12 2a1 1 0 0 1 1 1c0 .24-.103.446-.271.623A4.126 4.126 0 0 0 11 7.5V9h1c3.866 0 7 3.134 7 7v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-5c0-3.866 3.134-7 7-7h1V7.5a4.126 4.126 0 0 0-1.729-3.377A1.003 1.003 0 0 1 7 3a1 1 0 0 1 1-1h4z"/>
            </svg>
            <span className="ml-2 text-xl font-bold text-primary-500">Colorado Air & Asthma Tracker</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <button 
            onClick={() => setActiveTab('home')}
            className={`nav-link ${activeTab === 'home' ? 'nav-link-active' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('about-me')}
            className={`nav-link ${activeTab === 'about-me' ? 'nav-link-active' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About Me
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('books')}
            className={`nav-link ${activeTab === 'books' ? 'nav-link-active' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Book Recommendations
            </span>
          </button>
        </nav>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-500" />
          )}
        </button>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
