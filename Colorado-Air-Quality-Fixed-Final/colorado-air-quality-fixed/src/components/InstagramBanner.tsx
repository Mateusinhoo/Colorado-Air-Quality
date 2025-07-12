import React, { useState, useEffect } from 'react';

interface InstagramBannerProps {
  darkMode?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

const InstagramBanner: React.FC<InstagramBannerProps> = ({ darkMode = false, onVisibilityChange }) => {
  const [isVisible, setIsVisible] = useState(true); // Always start visible on page load

  const handleDismiss = () => {
    setIsVisible(false);
    onVisibilityChange?.(false);
    // Store dismissal only for current session, not permanently
    sessionStorage.setItem('instagram-banner-dismissed', 'true');
  };

  // Check if banner was dismissed in current session only
  useEffect(() => {
    const dismissed = sessionStorage.getItem('instagram-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
      onVisibilityChange?.(false);
    } else {
      onVisibilityChange?.(true);
    }
  }, [onVisibilityChange]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white shadow-lg`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center relative">
          {/* Centered content */}
          <div className="flex items-center justify-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="text-sm md:text-base font-medium">
                🌟 Get daily air quality updates and asthma insights! Follow us on Instagram for tips and Colorado air quality news.
              </p>
            </div>
            
            <div className="hidden sm:block">
              <a
                href="https://www.instagram.com/asthma.colorado/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Follow Us
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Close button positioned absolutely */}
          <button
            onClick={handleDismiss}
            className="absolute right-0 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            aria-label="Dismiss banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Mobile follow button */}
        <div className="sm:hidden mt-2 text-center">
          <a
            href="https://www.instagram.com/asthma.colorado/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Follow @asthma.colorado
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstagramBanner;

