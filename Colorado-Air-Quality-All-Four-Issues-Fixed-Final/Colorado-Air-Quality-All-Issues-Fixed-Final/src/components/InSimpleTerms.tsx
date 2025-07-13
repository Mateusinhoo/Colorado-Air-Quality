import React, { useState } from 'react';

interface InSimpleTermsProps {
  darkMode: boolean;
}

const InSimpleTerms: React.FC<InSimpleTermsProps> = ({ darkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState('books');

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          In Simple Terms
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore books and research papers that have shaped my understanding of health, science, and life
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8 overflow-x-auto justify-center">
          <button
            onClick={() => setActiveSubTab('books')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSubTab === 'books'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Book Recommendations
            </div>
          </button>
          
          <button
            onClick={() => setActiveSubTab('research')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSubTab === 'research'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Research Papers
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeSubTab === 'books' && (
        <div className="animate-fade-in">
          <BookRecommendations darkMode={darkMode} />
        </div>
      )}

      {activeSubTab === 'research' && (
        <div className="animate-fade-in">
          <ResearchPapers darkMode={darkMode} />
        </div>
      )}
    </div>
  );
};

// Book Recommendations Component
const BookRecommendations: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [expandedBook, setExpandedBook] = useState<string | null>(null);

  const books = [
    {
      id: 'gifted-hands',
      title: 'Gifted Hands',
      author: 'Ben Carson',
      coverUrl: '/api/placeholder/200/300', // Placeholder for book cover
      shortReview: 'An inspiring autobiography of a neurosurgeon who overcame poverty and academic struggles to become one of the world\'s leading pediatric neurosurgeons.',
      fullReview: `"Gifted Hands" is more than just an autobiography—it's a testament to the power of perseverance, faith, and the transformative impact of education. Ben Carson's journey from a struggling student in Detroit to becoming the director of pediatric neurosurgery at Johns Hopkins Hospital is nothing short of extraordinary.

What struck me most about this book was Carson's honesty about his early struggles. His transformation from a student with poor grades and a violent temper to a world-renowned surgeon didn't happen overnight. It was his mother's unwavering belief in education—despite her own limited schooling—that changed everything. Her requirement that Ben and his brother read two books a week and write reports on them was a simple yet profound intervention that opened up new worlds.

The book beautifully illustrates how reading can literally rewire our brains and expand our possibilities. Carson's description of how books transported him from the poverty of Detroit to ancient civilizations, scientific discoveries, and medical breakthroughs resonates deeply with my own experience as a student passionate about learning.

As someone pursuing medicine, I found Carson's detailed accounts of groundbreaking surgeries both thrilling and educational. His pioneering work in separating conjoined twins and his innovative surgical techniques demonstrate the importance of thinking outside conventional boundaries. But beyond the medical achievements, what impressed me most was his emphasis on treating patients with dignity and compassion.

The book also tackles important themes about overcoming adversity, the role of mentorship, and the responsibility that comes with success. Carson's commitment to giving back to his community and inspiring young people, particularly those from disadvantaged backgrounds, shows that true success isn't just about personal achievement—it's about lifting others up.

This book fundamentally changed how I think about obstacles. Instead of seeing challenges as barriers, Carson taught me to view them as opportunities for growth. His story reinforced my belief that with determination, hard work, and the right support system, we can overcome seemingly impossible odds.

For anyone interested in medicine, education, or simply human potential, "Gifted Hands" is essential reading. It's a reminder that our circumstances don't define our destiny—our choices do.`,
      rating: 5,
      tags: ['Biography', 'Medicine', 'Inspiration', 'Education']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-8">
        {books.map((book) => (
          <div key={book.id} className="card">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="w-48 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                    <p className="text-sm opacity-90">by {book.author}</p>
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {book.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    by {book.author}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < book.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {book.rating}/5 stars
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Short Review */}
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {book.shortReview}
                  </p>
                </div>

                {/* Read More Button */}
                <button
                  onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  {expandedBook === book.id ? 'Show Less' : 'Read More'}
                  <svg
                    className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${
                      expandedBook === book.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Review */}
            {expandedBook === book.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  My Detailed Review
                </h4>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {book.fullReview.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Research Papers Component
const ResearchPapers: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const papers = [
    {
      id: 'air-pollution-asthma',
      title: 'Air pollution and childhood asthma: Recent advances and future directions',
      authors: 'Khreis H, Kelly C, Tate J, Parslow R, Lucas K, Nieuwenhuijsen M',
      journal: 'Current Opinion in Environmental Science & Health',
      year: '2017',
      doi: '10.1016/j.coesh.2017.07.001',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/34655640/',
      shortSummary: 'This comprehensive review examines the relationship between air pollution exposure and childhood asthma, highlighting recent research advances and identifying key areas for future investigation.',
      fullReview: `This paper provides an excellent overview of the current state of research on air pollution and childhood asthma, which is directly relevant to the work I'm doing with this Colorado Air Quality Dashboard.

**Key Findings:**

The authors systematically review evidence showing that exposure to various air pollutants—particularly PM2.5, NO2, and ozone—significantly increases the risk of asthma development and exacerbation in children. What I found particularly compelling was their analysis of how different pollutants affect children at various developmental stages.

**Methodological Strengths:**

The paper excels in its comprehensive approach, examining both short-term and long-term exposure effects. The authors carefully distinguish between asthma incidence (new cases) and asthma exacerbation (worsening of existing conditions), which is crucial for understanding the full impact of air pollution on respiratory health.

**Personal Relevance:**

Growing up in São Paulo, I witnessed firsthand the respiratory health challenges described in this paper. The research validates what I observed in my community—that children in areas with higher pollution levels had more frequent asthma attacks and respiratory issues. This personal connection drives my passion for making air quality data more accessible through projects like this dashboard.

**Implications for Public Health:**

The paper emphasizes the importance of real-time air quality monitoring and public awareness, which aligns perfectly with the goals of this website. The authors argue that better data visualization and public access to air quality information can help families make informed decisions about outdoor activities and exposure reduction.

**Future Directions:**

I was particularly interested in the authors' call for more research on the lag time between pollution exposure and asthma symptoms. This directly influenced the time-lag analysis features I've implemented in the dashboard, allowing users to see how pollution levels correlate with health outcomes over different time periods.

**Critical Assessment:**

While the paper is comprehensive, I would have liked to see more discussion of socioeconomic factors that influence both pollution exposure and healthcare access. This is something I'm considering for future versions of the dashboard—incorporating demographic data to better understand health disparities.

**Connection to My Work:**

This research reinforces the importance of making air quality data accessible to the public, especially parents and caregivers of children with asthma. The dashboard's correlation analysis features are directly inspired by the methodologies discussed in this paper, particularly the emphasis on showing relationships between pollution levels and health outcomes.

The paper has been instrumental in shaping my understanding of how environmental data can be used to protect public health, and it continues to guide the development of new features for the Colorado Air Quality Dashboard.`,
      tags: ['Air Pollution', 'Childhood Asthma', 'Public Health', 'Environmental Health']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-8">
        {papers.map((paper) => (
          <div key={paper.id} className="card">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {paper.title}
              </h3>
              
              <div className="text-gray-600 dark:text-gray-400 mb-4">
                <p className="mb-1">
                  <strong>Authors:</strong> {paper.authors}
                </p>
                <p className="mb-1">
                  <strong>Journal:</strong> {paper.journal} ({paper.year})
                </p>
                <p className="mb-1">
                  <strong>DOI:</strong> {paper.doi}
                </p>
                <p>
                  <strong>PubMed:</strong>{' '}
                  <a
                    href={paper.pubmedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
                  >
                    View on PubMed
                  </a>
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {paper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Short Summary */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Summary
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {paper.shortSummary}
              </p>
            </div>

            {/* Read More Button */}
            <button
              onClick={() => setExpandedPaper(expandedPaper === paper.id ? null : paper.id)}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {expandedPaper === paper.id ? 'Show Less' : 'Read My Analysis'}
              <svg
                className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${
                  expandedPaper === paper.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded Review */}
            {expandedPaper === paper.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  My Detailed Analysis
                </h4>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {paper.fullReview.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="mb-4">
                      {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </h5>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {paragraph.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InSimpleTerms;

