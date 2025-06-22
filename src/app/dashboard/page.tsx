'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { TrendingUp, Users, MessageSquare, Calendar, Briefcase, GraduationCap } from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const activityItems = [
    {
      id: 1,
      type: 'connection',
      user: 'Sarah Johnson',
      action: 'connected with you',
      time: '2 hours ago',
      avatar: 'SJ'
    },
    {
      id: 2,
      type: 'update',
      user: 'Michael Chen',
      action: 'updated their profile',
      time: '4 hours ago',
      avatar: 'MC'
    },
    {
      id: 3,
      type: 'job',
      user: 'Alex Rivera',
      action: 'started a new position at Tech Corp',
      time: '1 day ago',
      avatar: 'AR'
    },
    {
      id: 4,
      type: 'education',
      user: 'Emily Davis',
      action: 'completed a certification in Data Science',
      time: '2 days ago',
      avatar: 'ED'
    }
  ];

  const suggestions = [
    { name: 'Jennifer Wilson', company: 'StartupXYZ', mutualConnections: 5, avatar: 'JW' },
    { name: 'David Park', company: 'Tech Solutions', mutualConnections: 3, avatar: 'DP' },
    { name: 'Lisa Chen', company: 'Innovation Labs', mutualConnections: 7, avatar: 'LC' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Stay connected with your professional network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                    <p className="text-sm text-gray-600">Connections</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-gray-600">Profile Views</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <MessageSquare className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">Messages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activityItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {item.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{item.user}</span> {item.action}
                        </p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {item.type === 'connection' && <Users className="w-4 h-4 text-blue-600" />}
                        {item.type === 'job' && <Briefcase className="w-4 h-4 text-green-600" />}
                        {item.type === 'education' && <GraduationCap className="w-4 h-4 text-purple-600" />}
                        {item.type === 'update' && <TrendingUp className="w-4 h-4 text-gray-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Photo</span>
                  <span className="text-xs text-blue-600">Add</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bio</span>
                  <span className="text-xs text-blue-600">Add</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Work Experience</span>
                  <span className="text-xs text-blue-600">Add</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-gray-500">40% complete</p>
              </div>
            </div>

            {/* People You May Know */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">People You May Know</h3>
              <div className="space-y-4">
                {suggestions.map((person, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                      {person.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.company}</p>
                      <p className="text-xs text-gray-500">{person.mutualConnections} mutual connections</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tech Meetup</p>
                    <p className="text-xs text-gray-500">Tomorrow, 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Career Fair</p>
                    <p className="text-xs text-gray-500">Friday, 10:00 AM</p>
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
