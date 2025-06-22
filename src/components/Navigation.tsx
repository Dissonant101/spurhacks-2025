'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Home, User, Search, LogOut, Bell } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-xl font-bold text-blue-400">
              SpurHacks Network
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <Link
                href="/outreach"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                Outreach
              </Link>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link
            href="/outreach"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800"
          >
            <Search className="w-4 h-4 mr-2" />
            Outreach
          </Link>
        </div>
      </div>
    </nav>
  );
}
