import React, { useEffect, useState } from 'react';

const AsthmaEducation: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Understanding Asthma
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how asthma affects your lungs and how air pollution can trigger symptoms
          </p>
        </div>

        {/* Person with lungs illustration */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="flex justify-center">
            <img 
              src="/person-lungs-outline.png" 
              alt="Person outline with lungs highlighted" 
              className="w-80 h-auto"
            />
          </div>

          {/* Information balloons with improved visibility */}
          <div 
            className={`absolute top-20 left-10 transform transition-all duration-1000 ${
              scrollY > 100 ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h3 className="font-bold text-gray-800 text-lg">Airways Narrow</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                During an asthma attack, the airways in your lungs become inflamed and narrow, making it difficult to breathe.
              </p>
              {/* Arrow pointing to lungs */}
              <div className="absolute -right-4 top-8 w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>

          <div 
            className={`absolute top-32 right-10 transform transition-all duration-1000 ${
              scrollY > 200 ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <h3 className="font-bold text-gray-800 text-lg">Mucus Production</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Excess mucus is produced, further blocking the already narrowed airways and causing coughing.
              </p>
              {/* Arrow pointing to lungs */}
              <div className="absolute -left-4 top-8 w-0 h-0 border-r-8 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>

          <div 
            className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
              scrollY > 300 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs border-l-4 border-blue-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="font-bold text-gray-800 text-lg">Muscle Tightening</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                The muscles around the airways tighten, making breathing even more difficult and causing wheezing.
              </p>
              {/* Arrow pointing up to lungs */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-b-8 border-b-white border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
            </div>
          </div>
        </div>

        {/* Air pollution triggers section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            How Air Pollution Triggers Asthma
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">PM2.5 Particles</h3>
              <p className="text-gray-600">
                Tiny particles that penetrate deep into lungs, causing inflammation and triggering asthma symptoms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Ozone</h3>
              <p className="text-gray-600">
                Ground-level ozone irritates airways and can worsen asthma symptoms, especially during hot days.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">NO2 & SO2</h3>
              <p className="text-gray-600">
                Nitrogen dioxide and sulfur dioxide from vehicles and industry can trigger asthma attacks.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="bg-blue-600 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Want to Learn More?
            </h2>
            <p className="text-blue-100 mb-6">
              Explore our detailed resources and book recommendations for a deeper understanding of air quality and health.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsthmaEducation;

