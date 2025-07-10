import axios from 'axios';
import { useState } from 'react';
import.meta.env.VITE_API_URL

const Recommend = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiCallCount, setApiCallCount] = useState(0);
  const [gptResponse, setGptResponse] = useState('');

  const MAX_API_CALLS = 250;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (apiCallCount >= MAX_API_CALLS) {
      setError('API call limit reached. Maximum 250 calls allowed.');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);
    setGptResponse('');

    try {
      // Call ChatGPT API for course recommendations
      const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful educational advisor. Based on the user's career goals or interests, recommend specific courses that would be beneficial. Format your response as a list of course recommendations with brief explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        }
      });

      const gptRecommendation = gptResponse.data.choices[0].message.content;
      setGptResponse(gptRecommendation);
      
      // Increment API call count
      setApiCallCount(prev => prev + 1);

      // Fetch available courses from backend
      const token = localStorage.getItem('token');
      const coursesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter courses based on GPT recommendation keywords
      const availableCourses = coursesResponse.data;
      const filteredCourses = filterCoursesByRecommendation(availableCourses, gptRecommendation);
      
      setRecommendations(filteredCourses);

    } catch (err) {
      if (err.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.');
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Please check your OpenAI API key.');
      } else {
        setError('Failed to get recommendations. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCoursesByRecommendation = (courses, recommendation) => {
    const keywords = extractKeywords(recommendation);
    return courses.filter(course => 
      keywords.some(keyword => 
        course.title.toLowerCase().includes(keyword.toLowerCase()) ||
        course.description.toLowerCase().includes(keyword.toLowerCase()) ||
        course.category?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const extractKeywords = (text) => {
    const commonKeywords = [
      'programming', 'javascript', 'python', 'react', 'node', 'web development',
      'data science', 'machine learning', 'ai', 'artificial intelligence',
      'database', 'sql', 'mongodb', 'backend', 'frontend', 'fullstack',
      'mobile development', 'android', 'ios', 'flutter', 'react native',
      'devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes',
      'cybersecurity', 'networking', 'linux', 'system administration',
      'ui/ux', 'design', 'photoshop', 'figma', 'user experience',
      'project management', 'agile', 'scrum', 'business analysis',
      'digital marketing', 'seo', 'social media', 'content marketing'
    ];
    
    return commonKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully enrolled in the course!');
    } catch (err) {
      alert('Failed to enroll in course');
    }
  };

  const commonPrompts = [
    "I want to be a software engineer, what courses should I follow?",
    "I'm interested in data science and machine learning",
    "How can I become a web developer?",
    "I want to learn mobile app development",
    "What courses do I need for cybersecurity?",
    "I'm interested in UI/UX design",
    "How to become a DevOps engineer?"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Recommendations</h1>
        <p className="text-gray-600">Get personalized course recommendations based on your career goals</p>
      </div>

      {/* API Usage Counter */}
      {/*<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700">API Calls Used</span>
          <span className="text-sm font-medium text-blue-800">{apiCallCount} / {MAX_API_CALLS}</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(apiCallCount / MAX_API_CALLS) * 100}%` }}
          ></div>
        </div>
      </div>*/}

      {/* Recommendation Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to learn or what career are you interested in?
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="E.g., I want to be a software engineer, what courses should I follow?"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || apiCallCount >= MAX_API_CALLS}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              loading || apiCallCount >= MAX_API_CALLS
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting Recommendations...
              </div>
            ) : (
              'Get Recommendations'
            )}
          </button>
        </form>

        {/* Common Prompts */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular searches:</h3>
          <div className="flex flex-wrap gap-2">
            {commonPrompts.map((commonPrompt, index) => (
              <button
                key={index}
                onClick={() => setPrompt(commonPrompt)}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                {commonPrompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GPT Response */}
      {gptResponse && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">AI Recommendation</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{gptResponse}</div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      By: {course.instructor?.name || 'Unknown'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.category || 'General'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      ${course.price || 'Free'}
                    </span>
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations Message */}
      {gptResponse && recommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            No matching courses found in our database. Check back later for more courses!
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;