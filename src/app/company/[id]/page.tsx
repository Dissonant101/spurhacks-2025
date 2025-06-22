'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { JobPosting } from '@/types';
import { 
  ArrowLeft,
  MapPin,
  Users,
  Globe,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  Share2,
  Mail,
} from 'lucide-react';

interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  founded?: number;
  specialties: string[];
  employees: number;
  logoUrl?: string;
}

export default function CompanyProfile() {
  const { user: currentUser, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const companyId = params?.id as string;
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock company data
  const mockCompanies: { [key: string]: CompanyProfile } = {
    '1': {
      id: '1',
      name: 'Tech Innovations Inc',
      industry: 'Technology',
      size: '201-1000 employees',
      location: 'San Francisco, CA',
      website: 'https://techinnovations.com',
      description: 'Tech Innovations Inc is a leading technology company focused on building scalable software solutions for enterprises. We specialize in cloud computing, artificial intelligence, and data analytics. Our mission is to empower businesses through innovative technology solutions.',
      founded: 2015,
      specialties: ['Cloud Computing', 'AI/ML', 'Data Analytics', 'Enterprise Software'],
      employees: 450,
    },
    '2': {
      id: '2',
      name: 'DataFlow Systems',
      industry: 'Data & Analytics',
      size: '51-200 employees',
      location: 'Austin, TX',
      website: 'https://dataflow.io',
      description: 'DataFlow Systems provides cutting-edge data analytics and business intelligence solutions. We help companies transform their data into actionable insights through our innovative platform and expert consulting services.',
      founded: 2018,
      specialties: ['Business Intelligence', 'Data Visualization', 'Machine Learning', 'Consulting'],
      employees: 125,
    },
    '3': {
      id: '3',
      name: 'StartupXYZ',
      industry: 'Software',
      size: '11-50 employees',
      location: 'New York, NY',
      website: 'https://startupxyz.com',
      description: 'StartupXYZ is a fast-growing startup building the next generation of productivity tools for remote teams. We believe in creating software that makes work more enjoyable and efficient.',
      founded: 2021,
      specialties: ['Productivity Tools', 'Remote Work', 'SaaS', 'Team Collaboration'],
      employees: 35,
    },
    '4': {
      id: '4',
      name: 'CloudTech Solutions',
      industry: 'Cloud Services',
      size: '201-1000 employees',
      location: 'Seattle, WA',
      website: 'https://cloudtech.solutions',
      description: 'CloudTech Solutions is a premier cloud infrastructure provider offering comprehensive DevOps and cloud migration services. We help organizations scale their infrastructure efficiently and securely.',
      founded: 2016,
      specialties: ['Cloud Infrastructure', 'DevOps', 'Security', 'Migration Services'],
      employees: 280,
    }
  };

  // Mock job postings for the company
  const mockJobsData: { [key: string]: JobPosting[] } = {
    '1': [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations Inc',
        companyId: '1',
        description: 'We are looking for a Senior Frontend Developer to join our dynamic team.',
        requirements: ['React', 'TypeScript', 'CSS', '5+ years experience'],
        location: 'San Francisco, CA',
        workMode: 'hybrid',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryRange: { min: 120000, max: 180000, currency: 'USD' },
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
        applicationDeadline: new Date('2025-07-15'),
        isActive: true,
        applicationsCount: 45,
        createdAt: new Date('2025-06-01'),
        updatedAt: new Date('2025-06-01')
      }
    ],
    '2': [
      {
        id: '2',
        title: 'Data Scientist Intern',
        company: 'DataFlow Systems',
        companyId: '2',
        description: 'Join our data science team as an intern and work on exciting machine learning projects.',
        requirements: ['Python', 'Machine Learning', 'Statistics', 'Recent graduate'],
        location: 'Austin, TX',
        workMode: 'remote',
        jobType: 'internship',
        experienceLevel: 'entry',
        salaryRange: { min: 4000, max: 6000, currency: 'USD' },
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
        benefits: ['Mentorship', 'Learning Budget', 'Flexible Hours'],
        applicationDeadline: new Date('2025-07-01'),
        isActive: true,
        applicationsCount: 123,
        createdAt: new Date('2025-05-20'),
        updatedAt: new Date('2025-05-20')
      }
    ]
  };

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    } else if (companyId) {
      const foundCompany = mockCompanies[companyId];
      if (foundCompany) {
        setCompany(foundCompany);
        setJobs(mockJobsData[companyId] || []);
        setIsFollowing(Math.random() > 0.5); // Mock following status
      } else {
        router.push('/jobs');
      }
    }
  }, [companyId, currentUser, isLoading, router]);

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

  if (!currentUser || !company) return null;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    alert(isFollowing ? 'Unfollowed company' : 'Following company');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${company.name} - Company Profile`,
        text: `Check out ${company.name}'s company profile and job opportunities`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Company profile link copied to clipboard!');
    }
  };

  const formatSalary = (job: JobPosting) => {
    if (!job.salaryRange) return 'Salary not specified';
    const { min, max, currency } = job.salaryRange;
    if (job.jobType === 'internship') {
      return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}/month`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}/year`;
  };

  const getWorkModeIcon = (mode: string) => {
    switch (mode) {
      case 'remote': return '🏠';
      case 'hybrid': return '🏢';
      case 'on-site': return '🏬';
      default: return '🏢';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Company Header */}
        <div className="bg-gray-800 rounded-lg shadow mb-6 border border-gray-700">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
                  <p className="text-gray-300 mb-2">{company.industry}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {company.size}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Founded {company.founded}
                    </span>
                    {company.website && (
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                    isFollowing 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow'}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About {company.name}</h2>
              <p className="text-gray-300 leading-relaxed">{company.description}</p>
            </div>

            {/* Specialties */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {company.specialties.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-900 text-blue-200 text-sm rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Open Positions */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Open Positions ({jobs.length})
              </h2>
              
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link href={`/jobs/${job.id}`}>
                            <h3 className="text-lg font-medium text-white hover:text-blue-400 cursor-pointer transition-colors">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-1">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              {getWorkModeIcon(job.workMode)} {job.workMode}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.jobType}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatSalary(job)}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-xs text-gray-400">+{job.skills.length - 4} more</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {job.applicationsCount} applicants
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link href={`/jobs/${job.id}`}>
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No open positions at the moment</p>
                  <p className="text-gray-500 text-sm mt-1">Follow this company to get notified about new openings</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Company Stats */}
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Company Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Industry</span>
                    <span className="text-white">{company.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company Size</span>
                    <span className="text-white">{company.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employees</span>
                    <span className="text-white">{company.employees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Founded</span>
                    <span className="text-white">{company.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{company.location}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
                <div className="space-y-3">
                  {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    careers@{company.name.toLowerCase().replace(/\s+/g, '')}.com
                  </div>
                </div>
              </div>

              {/* Follow Status */}
              {isFollowing && (
                <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <p className="text-green-200 text-sm">
                      You&#39;re following {company.name}. You&#39;ll get notified about new job postings and company updates.
                    </p>
                  </div>
                </div>
              )}

              {/* Similar Companies */}
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Similar Companies</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white text-sm">InnovateCorp</h4>
                    <p className="text-gray-400 text-xs">Technology • 100-500 employees</p>
                    <p className="text-blue-400 text-xs">5 open positions</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white text-sm">Future Systems</h4>
                    <p className="text-gray-400 text-xs">Software • 50-200 employees</p>
                    <p className="text-blue-400 text-xs">3 open positions</p>
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
