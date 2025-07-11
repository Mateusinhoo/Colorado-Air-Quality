import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-blue-600 opacity-90"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full opacity-20 transform -translate-x-16 translate-y-16"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Monitor Air Quality & Asthma Rates Across Colorado
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Real-time air quality data and asthma statistics to help you make informed 
            decisions about your health and environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg">
              Explore the Map
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

