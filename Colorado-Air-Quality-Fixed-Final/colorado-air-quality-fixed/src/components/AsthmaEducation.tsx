import React, { useEffect, useState } from 'react';

interface AsthmaEducationProps {
  darkMode?: boolean;
}

const AsthmaEducation: React.FC<AsthmaEducationProps> = ({ darkMode = false }) => {
  const [visibleBoxes, setVisibleBoxes] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      
      // Show boxes progressively based on scroll position
      // Start showing boxes earlier (at 10% scroll)
      const newVisibleBoxes: number[] = [];
      
      if (scrollPercentage > 0.1) newVisibleBoxes.push(1); // Airways Narrow
      if (scrollPercentage > 0.15) newVisibleBoxes.push(2); // Inflammation
      if (scrollPercentage > 0.2) newVisibleBoxes.push(3); // Mucus Production
      if (scrollPercentage > 0.25) newVisibleBoxes.push(4); // Breathing Difficulty
      if (scrollPercentage > 0.3) newVisibleBoxes.push(5); // Triggers
      if (scrollPercentage > 0.35) newVisibleBoxes.push(6); // Treatment
      
      setVisibleBoxes(newVisibleBoxes);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const informationBoxes = [
    {
      id: 1,
      title: "Airways Narrow",
      content: "During an asthma attack, the airways in your lungs become inflamed and narrow, making it difficult to breathe.",
      color: "from-red-400 to-red-600",
      position: "top-left",
      lineColor: "border-red-500"
    },
    {
      id: 2,
      title: "Inflammation",
      content: "Air pollution triggers inflammation in the respiratory system, worsening asthma symptoms and increasing sensitivity.",
      color: "from-orange-400 to-orange-600",
      position: "top-right",
      lineColor: "border-orange-500"
    },
    {
      id: 3,
      title: "Mucus Production",
      content: "Pollutants cause increased mucus production, further blocking airways and making breathing more difficult.",
      color: "from-yellow-400 to-yellow-600",
      position: "middle-left",
      lineColor: "border-yellow-500"
    },
    {
      id: 4,
      title: "Breathing Difficulty",
      content: "Poor air quality can trigger asthma attacks, leading to wheezing, coughing, and shortness of breath.",
      color: "from-green-400 to-green-600",
      position: "middle-right",
      lineColor: "border-green-500"
    },
    {
      id: 5,
      title: "Environmental Triggers",
      content: "PM2.5 particles and ozone are major asthma triggers that can penetrate deep into the lungs.",
      color: "from-blue-400 to-blue-600",
      position: "bottom-left",
      lineColor: "border-blue-500"
    },
    {
      id: 6,
      title: "Prevention & Treatment",
      content: "Monitoring air quality, using inhalers, and avoiding high pollution days can help manage asthma effectively.",
      color: "from-purple-400 to-purple-600",
      position: "bottom-right",
      lineColor: "border-purple-500"
    }
  ];

  const getBoxPosition = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'absolute top-8 left-8';
      case 'top-right':
        return 'absolute top-8 right-8';
      case 'middle-left':
        return 'absolute top-1/2 left-8 transform -translate-y-1/2';
      case 'middle-right':
        return 'absolute top-1/2 right-8 transform -translate-y-1/2';
      case 'bottom-left':
        return 'absolute bottom-8 left-8';
      case 'bottom-right':
        return 'absolute bottom-8 right-8';
      default:
        return 'absolute top-8 left-8';
    }
  };

  const getLinePosition = (position: string) => {
    const lungCenterX = 50; // Center of the lung figure (percentage)
    const lungCenterY = 50; // Center of the lung figure (percentage)
    
    switch (position) {
      case 'top-left':
        return `M 20,20 Q 35,35 ${lungCenterX - 15},${lungCenterY - 10}`;
      case 'top-right':
        return `M 80,20 Q 65,35 ${lungCenterX + 15},${lungCenterY - 10}`;
      case 'middle-left':
        return `M 20,50 Q 35,50 ${lungCenterX - 15},${lungCenterY}`;
      case 'middle-right':
        return `M 80,50 Q 65,50 ${lungCenterX + 15},${lungCenterY}`;
      case 'bottom-left':
        return `M 20,80 Q 35,65 ${lungCenterX - 15},${lungCenterY + 10}`;
      case 'bottom-right':
        return `M 80,80 Q 65,65 ${lungCenterX + 15},${lungCenterY + 10}`;
      default:
        return `M 20,20 Q 35,35 ${lungCenterX},${lungCenterY}`;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-16`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Understanding Asthma
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Learn how asthma affects your lungs and how air pollution can trigger symptoms
          </p>
        </div>

        {/* Interactive Lung Visualization */}
        <div className="relative w-full max-w-6xl mx-auto" style={{ height: '800px' }}>
          {/* Background for better contrast */}
          <div className={`absolute inset-0 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-2xl`}></div>
          
          {/* SVG for dashed lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-10" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {informationBoxes.map((box) => (
              visibleBoxes.includes(box.id) && (
                <path
                  key={`line-${box.id}`}
                  d={getLinePosition(box.position)}
                  stroke={box.lineColor.replace('border-', '').replace('-500', '')}
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                  fill="none"
                  className="animate-pulse"
                  style={{
                    filter: darkMode ? 'brightness(1.2)' : 'brightness(0.8)'
                  }}
                />
              )
            ))}
          </svg>

          {/* Central Lung Figure */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="relative">
              <img
                src="/person-lungs-outline.png"
                alt="Human figure with lungs highlighted"
                className={`w-96 h-96 object-contain ${darkMode ? 'filter brightness-110 contrast-110' : ''}`}
                style={{
                  filter: darkMode ? 'invert(1) brightness(0.9)' : 'none'
                }}
              />
              {/* Lung highlight overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-40 bg-red-500 opacity-30 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Information Boxes */}
          {informationBoxes.map((box) => (
            <div
              key={box.id}
              className={`${getBoxPosition(box.position)} w-72 z-30 transition-all duration-700 transform ${
                visibleBoxes.includes(box.id)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <div className={`
                ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} 
                rounded-xl p-6 shadow-2xl border-2 ${box.lineColor} 
                hover:shadow-3xl transition-all duration-300 hover:scale-105
              `}>
                <div className={`w-full h-2 bg-gradient-to-r ${box.color} rounded-full mb-4`}></div>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {box.title}
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {box.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Educational Content */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-8 shadow-xl`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Air Quality and Asthma Connection
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  How Air Pollution Affects Asthma
                </h3>
                <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    PM2.5 particles penetrate deep into lungs
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Ozone irritates airways and triggers inflammation
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Poor air quality increases emergency room visits
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Children and elderly are most vulnerable
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Protection Strategies
                </h3>
                <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Monitor daily air quality index (AQI)
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Stay indoors on high pollution days
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    Use air purifiers in your home
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    Keep rescue inhalers accessible
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-2xl p-8 shadow-xl`}>
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              Stay Informed About Air Quality
            </h3>
            <p className={`text-lg mb-6 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Check our real-time air quality data to protect your respiratory health
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`
                px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105
                ${darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
                shadow-lg hover:shadow-xl
              `}
            >
              View Current Air Quality
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsthmaEducation;

