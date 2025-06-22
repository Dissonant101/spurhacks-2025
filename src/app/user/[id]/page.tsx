'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { User, AccountType } from '@/types';
import { 
  ArrowLeft,
  User as UserIcon,
  Mail,
  Building,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  MessageCircle,
  UserPlus,
  Users,
  Globe,
  Phone,
  Share2
} from 'lucide-react';

export default function UserProfile() {
  const { user: currentUser, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const [profile, setProfile] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionRequested, setConnectionRequested] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    } else if (userId && currentUser) {
      // Check if viewing own profile
      if (userId === currentUser.id) {
        router.push('/profile');
        return;
      }

      // Load user profile from localStorage or use mock data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let foundUser = users.find((u: any) => u.id === userId);
      
      // If not found in localStorage, use mock data for demo purposes
      if (!foundUser) {
        const mockUsers: any = {
          'user-1': {
            id: 'user-1',
            accountType: 'user',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@example.com',
            bio: 'Experienced software engineer with a passion for building scalable web applications.',
            education: [
              {
                id: '1',
                institution: 'Stanford University',
                degree: 'Master of Science',
                fieldOfStudy: 'Computer Science',
                startDate: new Date('2018-09-01'),
                endDate: new Date('2020-06-01'),
                current: false,
                description: 'Specialized in machine learning and distributed systems'
              }
            ],
            workExperience: [
              {
                id: '1',
                company: 'Tech Innovations Inc',
                position: 'Senior Software Engineer',
                location: 'San Francisco, CA',
                startDate: new Date('2020-07-01'),
                current: true,
                description: 'Leading development of microservices architecture'
              }
            ],
            skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes']
          },
          'user-2': {
            id: 'user-2',
            accountType: 'user',
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@example.com',
            bio: 'Product manager with expertise in B2B SaaS and user experience design.',
            education: [
              {
                id: '1',
                institution: 'UC Berkeley',
                degree: 'Bachelor of Arts',
                fieldOfStudy: 'Business Administration',
                startDate: new Date('2016-09-01'),
                endDate: new Date('2020-05-01'),
                current: false
              }
            ],
            workExperience: [
              {
                id: '1',
                company: 'DataFlow Systems',
                position: 'Product Manager',
                location: 'Austin, TX',
                startDate: new Date('2021-03-01'),
                current: true,
                description: 'Managing product roadmap for analytics platform'
              }
            ],
            skills: ['Product Strategy', 'User Research', 'Agile', 'SQL', 'Figma']
          },
          // Add more mock users for user-3, user-4, etc.
          'user-3': {
            id: 'user-3',
            accountType: 'user',
            firstName: 'Alex',
            lastName: 'Rivera',
            email: 'alex.rivera@example.com',
            bio: 'DevOps engineer passionate about automation and cloud infrastructure.',
            education: [],
            workExperience: [
              {
                id: '1',
                company: 'Tech Corp',
                position: 'DevOps Engineer',
                location: 'Seattle, WA',
                startDate: new Date('2022-01-01'),
                current: true,
                description: 'Building CI/CD pipelines and managing cloud infrastructure'
              }
            ],
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python']
          },
          'user-4': {
            id: 'user-4',
            accountType: 'user',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@example.com',
            bio: 'Data scientist with expertise in machine learning and analytics.',
            education: [
              {
                id: '1',
                institution: 'MIT',
                degree: 'PhD',
                fieldOfStudy: 'Data Science',
                startDate: new Date('2019-09-01'),
                endDate: new Date('2023-05-01'),
                current: false,
                description: 'Research focus on natural language processing'
              }
            ],
            workExperience: [],
            skills: ['Python', 'TensorFlow', 'Machine Learning', 'SQL', 'R']
          },
          'user-5': {
            id: 'user-5',
            accountType: 'user',
            firstName: 'Jennifer',
            lastName: 'Wilson',
            email: 'jennifer.wilson@example.com',
            bio: 'Frontend developer with a focus on user experience and accessibility.',
            education: [],
            workExperience: [
              {
                id: '1',
                company: 'StartupXYZ',
                position: 'Frontend Developer',
                location: 'New York, NY',
                startDate: new Date('2021-06-01'),
                current: true,
                description: 'Building responsive web applications with React'
              }
            ],
            skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Accessibility']
          },
          'user-6': {
            id: 'user-6',
            accountType: 'user',
            firstName: 'David',
            lastName: 'Park',
            email: 'david.park@example.com',
            bio: 'Backend engineer specializing in distributed systems.',
            education: [],
            workExperience: [
              {
                id: '1',
                company: 'Tech Solutions',
                position: 'Backend Engineer',
                location: 'Los Angeles, CA',
                startDate: new Date('2020-09-01'),
                current: true,
                description: 'Developing scalable microservices'
              }
            ],
            skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL']
          },
          'user-7': {
            id: 'user-7',
            accountType: 'user',
            firstName: 'Lisa',
            lastName: 'Chen',
            email: 'lisa.chen@example.com',
            bio: 'UX designer passionate about creating intuitive user experiences.',
            education: [],
            workExperience: [
              {
                id: '1',
                company: 'Innovation Labs',
                position: 'UX Designer',
                location: 'San Francisco, CA',
                startDate: new Date('2021-01-01'),
                current: true,
                description: 'Designing user interfaces for mobile applications'
              }
            ],
            skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems']
          }
        };
        
        foundUser = mockUsers[userId];
      }
      
      if (foundUser && foundUser.accountType === 'user') {
        setProfile(foundUser);
        // Check if already connected (mock logic)
        setIsConnected(Math.random() > 0.7);
        setConnectionRequested(Math.random() > 0.8);
      } else {
        router.push('/dashboard');
      }
    }
  }, [userId, currentUser, isLoading, router]);

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

  if (!currentUser || !profile) return null;

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      alert('Connection removed');
    } else if (connectionRequested) {
      alert('Connection request already sent');
    } else {
      setConnectionRequested(true);
      alert('Connection request sent!');
    }
  };

  const handleMessage = () => {
    alert('Message feature would open here');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.firstName} ${profile.lastName}'s Profile`,
        text: `Check out ${profile.firstName}'s professional profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const getConnectionButtonText = () => {
    if (isConnected) return 'Connected';
    if (connectionRequested) return 'Request Sent';
    return 'Connect';
  };

  const getConnectionButtonClass = () => {
    if (isConnected) {
      return 'bg-green-600 hover:bg-green-700 text-white';
    }
    if (connectionRequested) {
      return 'bg-gray-600 text-gray-300 cursor-not-allowed';
    }
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  const getMutualConnections = () => {
    // Mock mutual connections count
    return Math.floor(Math.random() * 20) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg shadow mb-6 border border-gray-700">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-300 mt-1">{profile.bio || 'No bio available'}</p>
                  <div className="flex items-center text-gray-400 mt-2">
                    <Mail className="w-4 h-4 mr-1" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {!isConnected && (
                    <div className="flex items-center text-gray-400 mt-1">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">{getMutualConnections()} mutual connections</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
                <button
                  onClick={handleConnect}
                  disabled={connectionRequested && !isConnected}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${getConnectionButtonClass()}`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {getConnectionButtonText()}
                </button>
                <button
                  onClick={handleMessage}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 flex items-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 flex items-center transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </h2>
            </div>
            <div className="p-6">
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4">
                      <h3 className="font-medium text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className="text-blue-400">{edu.institution}</p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : 'N/A'}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-gray-300 mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No education information available</p>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Work Experience
              </h2>
            </div>
            <div className="p-6">
              {profile.workExperience && profile.workExperience.length > 0 ? (
                <div className="space-y-4">
                  {profile.workExperience.map((work, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4">
                      <h3 className="font-medium text-white">{work.position}</h3>
                      <p className="text-green-400">{work.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(work.startDate).getFullYear()} - {work.current ? 'Present' : work.endDate ? new Date(work.endDate).getFullYear() : 'N/A'}
                        </span>
                        {work.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {work.location}
                          </span>
                        )}
                      </div>
                      {work.description && (
                        <p className="text-sm text-gray-300 mt-2">{work.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No work experience available</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-800 rounded-lg shadow mt-6 border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Skills
            </h2>
          </div>
          <div className="p-6">
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No skills listed</p>
            )}
          </div>
        </div>

        {/* Connection Status */}
        {isConnected && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mt-6">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-200">
                You're connected with {profile.firstName}. You can now message them directly and see their activity updates.
              </p>
            </div>
          </div>
        )}

        {/* Activity Section (if connected) */}
        {isConnected && (
          <div className="bg-gray-800 rounded-lg shadow mt-6 border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                    {profile.firstName[0]}
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">{profile.firstName}</span> updated their skills
                    </p>
                    <p className="text-gray-500 text-xs">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
                    {profile.firstName[0]}
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">{profile.firstName}</span> connected with a new professional
                    </p>
                    <p className="text-gray-500 text-xs">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
