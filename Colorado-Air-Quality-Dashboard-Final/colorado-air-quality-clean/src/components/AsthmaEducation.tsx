import React, { useEffect, useState } from 'react';

interface AsthmaEducationProps {
  darkMode: boolean;
}

const AsthmaEducation: React.FC<AsthmaEducationProps> = ({ darkMode }) => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Calculate which elements should be visible based on scroll position
      const newVisibleElements: number[] = [];
      
      // Show elements progressively as user scrolls
      if (scrollPosition > 200) newVisibleElements.push(1);
      if (scrollPosition > 400) newVisibleElements.push(2);
      if (scrollPosition > 600) newVisibleElements.push(3);
      if (scrollPosition > 800) newVisibleElements.push(4);
      if (scrollPosition > 1000) newVisibleElements.push(5);
      if (scrollPosition > 1200) newVisibleElements.push(6);
      
      setVisibleElements(newVisibleElements);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisible = (elementId: number) => visibleElements.includes(elementId);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Understanding Asthma
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Learn how asthma affects your lungs and how air pollution can trigger symptoms
        </p>
      </div>

      {/* Interactive Lung Visualization */}
      <div className="relative max-w-4xl mx-auto mb-16">
        <div className="relative flex justify-center items-center min-h-[600px]">
          {/* Lung Illustration */}
          <div className="relative">
            <img 
              src="/lung-illustration.png" 
              alt="Human lungs anatomy" 
              className="w-80 h-80 object-contain"
            />
            
            {/* Interactive Information Balloons */}
            
            {/* Balloon 1: Airways */}
            <div className={`absolute top-16 left-8 transform transition-all duration-1000 ${
              isVisible(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="relative">
                {/* Arrow pointing to airways */}
                <svg className="absolute -right-16 top-4 w-16 h-8" viewBox="0 0 64 32">
                  <path 
                    d="M2 16 L50 16 M42 8 L50 16 L42 24" 
                    stroke={darkMode ? '#60A5FA' : '#3B82F6'} 
                    strokeWidth="2" 
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                </svg>
                
                {/* Information balloon */}
                <div className="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg p-4 w-64 shadow-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Airways (Bronchi)</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    These tubes carry air to your lungs. In asthma, they become inflamed and narrow, making breathing difficult.
                  </p>
                </div>
              </div>
            </div>

            {/* Balloon 2: Inflammation */}
            <div className={`absolute top-32 right-8 transform transition-all duration-1000 ${
              isVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="relative">
                {/* Arrow pointing to lung tissue */}
                <svg className="absolute -left-16 top-4 w-16 h-8" viewBox="0 0 64 32">
                  <path 
                    d="M62 16 L14 16 M22 8 L14 16 L22 24" 
                    stroke={darkMode ? '#F87171' : '#EF4444'} 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
                
                <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 w-64 shadow-lg">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Inflammation</h3>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Asthma causes the airways to become swollen and inflamed, reducing airflow and making breathing harder.
                  </p>
                </div>
              </div>
            </div>

            {/* Balloon 3: Mucus Production */}
            <div className={`absolute bottom-32 left-8 transform transition-all duration-1000 ${
              isVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="relative">
                <svg className="absolute -right-16 top-4 w-16 h-8" viewBox="0 0 64 32">
                  <path 
                    d="M2 16 L50 16 M42 8 L50 16 L42 24" 
                    stroke={darkMode ? '#34D399' : '#10B981'} 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
                
                <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-4 w-64 shadow-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Excess Mucus</h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Airways produce extra mucus during asthma attacks, further blocking airflow and causing coughing.
                  </p>
                </div>
              </div>
            </div>

            {/* Balloon 4: Muscle Tightening */}
            <div className={`absolute bottom-16 right-8 transform transition-all duration-1000 ${
              isVisible(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="relative">
                <svg className="absolute -left-16 top-4 w-16 h-8" viewBox="0 0 64 32">
                  <path 
                    d="M62 16 L14 16 M22 8 L14 16 L22 24" 
                    stroke={darkMode ? '#A78BFA' : '#8B5CF6'} 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
                
                <div className="bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700 rounded-lg p-4 w-64 shadow-lg">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Muscle Constriction</h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Muscles around the airways tighten during an asthma attack, making the airways even narrower.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Air Pollution Impact Section */}
      <div className={`max-w-4xl mx-auto mb-16 transform transition-all duration-1000 ${
        isVisible(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-xl p-8 border border-orange-200 dark:border-orange-700">
          <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            How Air Pollution Triggers Asthma
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">PM2.5 Particles</h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm mb-4">
                These tiny particles can penetrate deep into your lungs, causing inflammation and triggering asthma symptoms.
              </p>
              
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Ozone (O₃)</h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Ground-level ozone irritates the airways, making them more sensitive and prone to asthma attacks.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Immediate Effects</h4>
              <ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1 mb-4">
                <li>• Increased coughing and wheezing</li>
                <li>• Shortness of breath</li>
                <li>• Chest tightness</li>
              </ul>
              
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Long-term Impact</h4>
              <ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
                <li>• Increased frequency of attacks</li>
                <li>• Reduced lung function</li>
                <li>• Greater sensitivity to triggers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={`text-center transform transition-all duration-1000 ${
        isVisible(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-8 border border-blue-200 dark:border-blue-700">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Want to Learn More?
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-2xl mx-auto">
            If you want to know more about asthma, check out the "In Simple Terms" tab of this website for detailed explanations, book recommendations, and research papers.
          </p>
          <button 
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent('navigateToInSimpleTerms');
              window.dispatchEvent(event);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Explore "In Simple Terms"
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsthmaEducation;

