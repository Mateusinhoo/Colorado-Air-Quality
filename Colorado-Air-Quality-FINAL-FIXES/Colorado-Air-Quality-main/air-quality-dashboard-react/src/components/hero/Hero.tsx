import React from 'react';

interface HeroProps {
  scrollToMap: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToMap }) => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Colorado mountains" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 mix-blend-multiply" />
      </div>
      
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Monitor Air Quality & Asthma Rates Across Colorado
          </h1>
          <p className="text-xl mb-8">
            Real-time air quality data and asthma statistics to help you make informed decisions about your health and environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToMap}
              className="px-6 py-3 bg-white text-primary-700 font-medium rounded-md hover:bg-gray-100 transition shadow-md"
            >
              Explore the Map
            </button>
            <a 
              href="https://www.epa.gov/outdoor-air-quality-data" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
