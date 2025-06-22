'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { SearchFilters } from '@/types';
import { 
  Search, 
  Bot, 
  Send, 
  Filter, 
  User, 
  Building, 
  MapPin, 
  Award,
  Users,
  MessageCircle,
  Loader
} from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  position: string;
  company: string;
  location?: string;
  skills: string[];
  degreeOfConnection: number;
  mutualConnections: number;
  avatar: string;
  bio?: string;
}

export default function Outreach() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    company: '',
    position: '',
    industry: '',
    location: '',
    skills: [],
  });

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      position: 'Hiring Manager',
      company: 'Tech Innovations Inc',
      location: 'San Francisco, CA',
      skills: ['Recruitment', 'Talent Acquisition', 'HR'],
      degreeOfConnection: 1,
      mutualConnections: 5,
      avatar: 'SC',
      bio: 'Experienced hiring manager focused on technical talent acquisition.'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      position: 'Senior Software Engineer',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      degreeOfConnection: 2,
      mutualConnections: 12,
      avatar: 'MR',
      bio: 'Full-stack developer with 8+ years of experience in scalable web applications.'
    },
    {
      id: '3',
      name: 'Jennifer Park',
      position: 'VP of Engineering',
      company: 'StartupXYZ',
      location: 'Remote',
      skills: ['Leadership', 'System Architecture', 'Team Building'],
      degreeOfConnection: 3,
      mutualConnections: 3,
      avatar: 'JP',
      bio: 'Engineering leader passionate about building high-performing teams.'
    },
    {
      id: '4',
      name: 'David Kim',
      position: 'Product Manager',
      company: 'InnovateCorp',
      location: 'Seattle, WA',
      skills: ['Product Strategy', 'User Research', 'Agile'],
      degreeOfConnection: 2,
      mutualConnections: 8,
      avatar: 'DK',
      bio: 'Product manager with expertise in B2B SaaS and user experience design.'
    }
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    
    setIsAiThinking(true);
    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        `Based on your query "${aiQuery}", I found several relevant connections in your network. Here are the most promising leads:

1. **Sarah Chen** (1st degree) - She's a Hiring Manager at Tech Innovations Inc. Given her role in talent acquisition, she would be perfect for discussing job opportunities or getting insights into the hiring process at tech companies.

2. **Jennifer Park** (3rd degree) - VP of Engineering at StartupXYZ. Though she's a 3rd degree connection, you share 3 mutual connections who could provide a warm introduction. She'd be valuable for leadership insights and startup advice.

**Suggested approach:** Start with Sarah Chen since she's a direct connection. For Jennifer Park, consider reaching out to your mutual connections first.`,

        `I understand you're looking for "${aiQuery}". Here's my analysis of your network:

**Best matches found:**
- **Michael Rodriguez** (2nd degree): Senior Software Engineer with relevant technical skills
- **David Kim** (2nd degree): Product Manager who could provide industry insights

**Connection strategy:**
1. Use your 12 mutual connections with Michael Rodriguez for a warm introduction
2. Leverage your 8 mutual connections with David Kim for referrals

**Next steps:** I recommend drafting personalized messages highlighting shared connections and specific value propositions.`,
      ];
      
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsAiThinking(false);
    }, 2000);
  };

  const getDegreeText = (degree: number) => {
    switch (degree) {
      case 1: return '1st degree';
      case 2: return '2nd degree';
      case 3: return '3rd degree';
      default: return `${degree}th degree`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Network Outreach</h1>
          <p className="mt-2 text-gray-300">
            Find and connect with professionals through your network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Search People</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, company, or position..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 flex items-center"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {isSearching ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="p-4 bg-gray-700 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Company"
                        value={filters.company}
                        onChange={(e) => setFilters({...filters, company: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={filters.position}
                        onChange={(e) => setFilters({...filters, position: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Industry"
                        value={filters.industry}
                        onChange={(e) => setFilters({...filters, industry: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Search Results</h3>
              </div>
              <div className="p-6">
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <div key={result.id} className="border border-gray-600 bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {result.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <Link href={`/user/${result.id}`}>
                                  <h4 className="text-lg font-medium text-white hover:text-blue-400 cursor-pointer transition-colors">{result.name}</h4>
                                </Link>
                                <p className="text-blue-400">{result.position}</p>
                                <p className="text-gray-300 flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  {result.company}
                                </p>
                                {result.location && (
                                  <p className="text-gray-400 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {result.location}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                                  {getDegreeText(result.degreeOfConnection)}
                                </span>
                                <p className="text-xs text-gray-400 mt-1 flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {result.mutualConnections} mutual
                                </p>
                              </div>
                            </div>
                            
                            {result.bio && (
                              <p className="text-sm text-gray-300 mt-2">{result.bio}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded">
                                  <Award className="w-3 h-3 mr-1" />
                                  {skill}
                                </span>
                              ))}
                              {result.skills.length > 3 && (
                                <span className="text-xs text-gray-400">+{result.skills.length - 3} more</span>
                              )}
                            </div>
                            
                            <div className="flex space-x-2 mt-3">
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                Connect
                              </button>
                              <button className="px-3 py-1 bg-gray-600 text-gray-300 text-sm rounded hover:bg-gray-500 flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Search for professionals to expand your network</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Bot className="w-6 h-6 mr-2 text-blue-400" />
                AI Networking Assistant
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                Ask me to help find specific people or connections in your network
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* AI Query Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g., 'Find me a hiring manager at a tech company' or 'Who can introduce me to someone at Google?'"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                  />
                  <button
                    onClick={handleAiQuery}
                    disabled={isAiThinking || !aiQuery.trim()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {isAiThinking ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* AI Response */}
                {(aiResponse || isAiThinking) && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        {isAiThinking ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                            <span className="text-blue-400 text-sm">AI is analyzing your network...</span>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none text-gray-300">
                            {aiResponse.split('\n').map((line, index) => (
                              <p key={index} className="mb-2 whitespace-pre-wrap">{line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setAiQuery("Find me hiring managers at tech companies")}
                      className="text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                    >
                      Find hiring managers at tech companies
                    </button>
                    <button
                      onClick={() => setAiQuery("Who can introduce me to someone at a startup?")}
                      className="text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                    >
                      Find startup connections
                    </button>
                    <button
                      onClick={() => setAiQuery("Look for VCs or investors in my network")}
                      className="text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                    >
                      Find VCs or investors
                    </button>
                    <button
                      onClick={() => setAiQuery("Find software engineers who could mentor me")}
                      className="text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                    >
                      Find potential mentors
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
