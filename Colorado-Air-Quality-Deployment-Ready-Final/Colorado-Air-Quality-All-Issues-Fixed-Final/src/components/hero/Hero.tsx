import React from 'react';

interface HeroProps {
  onExploreMap?: () => void;
  onLearnMore?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreMap, onLearnMore }) => {
  const handleExploreMap = () => {
    if (onExploreMap) {
      onExploreMap();
    }
    // Scroll to map section
    setTimeout(() => {
      const mapSection = document.getElementById('map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    }
    // Scroll to asthma education section
    setTimeout(() => {
      const asthmaSection = document.getElementById('asthma-section');
      if (asthmaSection) {
        asthmaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="relative text-white py-20 overflow-hidden">
      {/* Denver Background Image with Blue Tint */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(29, 78, 216, 0.9)), url('https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
        }}
      ></div>
      
      {/* Additional blue overlay for better contrast */}
      <div className="absolute inset-0 bg-blue-600 opacity-40"></div>
      
      {/* Background decoration circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full opacity-10 transform -translate-x-16 translate-y-16"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
            Monitor Air Quality & Asthma Rates Across Colorado
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Real-time air quality data and asthma statistics to help you make informed 
            decisions about your health and environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleExploreMap}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore the Map
            </button>
            <button 
              onClick={handleLearnMore}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

