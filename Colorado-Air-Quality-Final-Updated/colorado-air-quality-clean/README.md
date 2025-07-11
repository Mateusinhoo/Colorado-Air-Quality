# Colorado Air Quality Dashboard - Enhanced Version

A comprehensive React application that visualizes the correlation between air pollution and asthma rates across Colorado.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Extract the ZIP file** to your desired location
2. **Open terminal/command prompt** in the project directory
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm start
   ```
5. **Open your browser** and navigate to `http://localhost:3000`

## 🆕 New Features

### Enhanced Navigation
- **Home**: Interactive map and data visualization
- **Asthma**: Educational content with lung visualization
- **About Me**: Personal profile and background
- **In Simple Terms**: Book recommendations and research papers

### Interactive Elements
- **Scroll-triggered animations** in the Asthma education section
- **Interactive lung visualization** with educational balloons
- **Book recommendations** with ratings and detailed reviews
- **Research paper summaries** with PubMed links

### Fixed Issues
- ✅ City data display now shows actual pollution rankings
- ✅ All data source links are working and updated
- ✅ Responsive design for all screen sizes
- ✅ TypeScript compilation errors resolved

## 📁 Project Structure

```
colorado-air-quality-clean/
├── src/
│   ├── components/
│   │   ├── AsthmaEducation.tsx    # Interactive asthma education
│   │   ├── AboutMe.tsx            # Personal profile page
│   │   ├── InSimpleTerms.tsx      # Books and research papers
│   │   ├── charts/
│   │   ├── hero/
│   │   ├── layout/
│   │   ├── map/
│   │   └── stats/
│   ├── context/
│   │   └── DataContext.tsx        # Enhanced data management
│   ├── services/
│   └── App.tsx                    # Main application component
├── public/
│   └── lung-illustration.png     # Generated lung visualization
├── package.json
└── README.md
```

## 🎨 Features Overview

### Home Dashboard
- Real-time air quality map of Colorado
- Statistics cards with key metrics
- Most polluted and cleanest cities rankings
- Trend analysis charts
- Asthma prevalence data

### Asthma Education
- Interactive lung illustration
- Scroll-triggered educational content
- Information about air pollution effects
- Links to health resources

### About Me
- Personal story connecting São Paulo to Colorado
- Pre-med student and developer background
- Links to social profiles and recommendations

### In Simple Terms
- **Book Recommendations**: "Gifted Hands" by Ben Carson with detailed review
- **Research Papers**: Air pollution and childhood asthma research with analysis
- Professional citation format with PubMed links

## 🔧 Technical Details

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Maps**: Leaflet for interactive mapping
- **Charts**: Recharts for data visualization
- **Data Sources**: EPA AirNow API, CDC Environmental Health Tracking

## 🌐 Data Sources

- **Air Quality**: EPA AirNow API
- **Asthma Statistics**: CDC Environmental Health Tracking Network
- **Geographic Data**: U.S. Census Bureau
- **Research Papers**: PubMed database

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

To build for production:
```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

## 📞 Support

For questions or issues, please refer to the technical documentation or contact the developer through the links provided in the About Me section.

---

**© 2025 Colorado Air & Asthma Tracker. All rights reserved.**

