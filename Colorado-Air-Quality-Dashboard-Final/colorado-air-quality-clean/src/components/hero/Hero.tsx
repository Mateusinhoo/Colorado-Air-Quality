import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-accent-500 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L50 0 L50 50 L0 50 Z" fill="currentColor" />
          <path d="M50 0 L100 0 L100 50 L50 50 Z" fill="currentColor" />
          <path d="M0 50 L50 50 L50 100 L0 100 Z" fill="currentColor" />
          <path d="M50 50 L100 50 L100 100 L50 100 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
            Colorado Air & Asthma Tracker
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Explore real-time air quality across Colorado and understand its impact on asthma rates. 
            Make informed decisions for your respiratory health.
          </p>
          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <a 
              href="#map-section" 
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Map
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          className="relative block w-full h-16 md:h-24" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="text-background dark:text-gray-900"
          />
        </svg>
      </div>
      
      {/* Animated lung icon */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-40 h-40 text-white/20 animate-breath"
        >
          <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1c0 .24-.103.446-.271.623A4.126 4.126 0 0 0 11 7.5V9h1c3.866 0 7 3.134 7 7v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-5c0-3.866 3.134-7 7-7h1V7.5a4.126 4.126 0 0 0-1.729-3.377A1.003 1.003 0 0 1 7 3a1 1 0 0 1 1-1h4z"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
