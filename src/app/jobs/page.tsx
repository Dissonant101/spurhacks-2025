'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { JobPosting, JobFilters, WorkMode, JobType, ExperienceLevel } from '@/types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';

export default function Jobs() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});

  // Mock job data
  const mockJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc',
      companyId: '1',
      description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for creating amazing user experiences using React, TypeScript, and modern web technologies.',
      requirements: ['React', 'TypeScript', 'CSS', '5+ years experience'],
      location: 'San Francisco, CA',
      workMode: 'hybrid',
      jobType: 'full-time',
      experienceLevel: 'senior',
      salaryRange: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      },
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
      applicationDeadline: new Date('2025-07-15'),
      isActive: true,
      applicationsCount: 45,
      createdAt: new Date('2025-06-01'),
      updatedAt: new Date('2025-06-01')
    },
    {
      id: '2',
      title: 'Data Scientist Intern',
      company: 'DataFlow Systems',
      companyId: '2',
      description: 'Join our data science team as an intern and work on exciting machine learning projects. Perfect opportunity for students or recent graduates.',
      requirements: ['Python', 'Machine Learning', 'Statistics', 'Recent graduate'],
      location: 'Austin, TX',
      workMode: 'remote',
      jobType: 'internship',
      experienceLevel: 'entry',
      salaryRange: {
        min: 4000,
        max: 6000,
        currency: 'USD'
      },
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      benefits: ['Mentorship', 'Learning Budget', 'Flexible Hours'],
      applicationDeadline: new Date('2025-07-01'),
      isActive: true,
      applicationsCount: 123,
      createdAt: new Date('2025-05-20'),
      updatedAt: new Date('2025-05-20')
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'StartupXYZ',
      companyId: '3',
      description: 'Lead product strategy and work with cross-functional teams to deliver innovative solutions. Experience with B2B SaaS products preferred.',
      requirements: ['Product Strategy', 'Agile', '3+ years PM experience'],
      location: 'New York, NY',
      workMode: 'on-site',
      jobType: 'full-time',
      experienceLevel: 'mid',
      salaryRange: {
        min: 130000,
        max: 170000,
        currency: 'USD'
      },
      skills: ['Product Management', 'Agile', 'User Research', 'Analytics'],
      benefits: ['Health Insurance', 'Equity', 'Professional Development'],
      isActive: true,
      applicationsCount: 67,
      createdAt: new Date('2025-06-10'),
      updatedAt: new Date('2025-06-10')
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      companyId: '4',
      recruiterId: 'rec1',
      description: 'Build and maintain cloud infrastructure, automate deployments, and ensure system reliability. Experience with AWS and Kubernetes required.',
      requirements: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', '4+ years experience'],
      location: 'Seattle, WA',
      workMode: 'hybrid',
      jobType: 'full-time',
      experienceLevel: 'senior',
      salaryRange: {
        min: 140000,
        max: 190000,
        currency: 'USD'
      },
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Python'],
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Learning Budget'],
      isActive: true,
      applicationsCount: 34,
      createdAt: new Date('2025-06-15'),
      updatedAt: new Date('2025-06-15')
    }
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.workMode) {
      filtered = filtered.filter(job => job.workMode === filters.workMode);
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(job =>
        job.salaryRange && job.salaryRange.min >= filters.salaryMin!
      );
    }

    setFilteredJobs(filtered);
  }, [searchQuery, filters, jobs]);

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

  const formatSalary = (job: JobPosting) => {
    if (!job.salaryRange) return 'Salary not specified';
    const { min, max, currency } = job.salaryRange;
    if (job.jobType === 'internship') {
      return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}/month`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}/year`;
  };

  const getWorkModeIcon = (mode: WorkMode) => {
    switch (mode) {
      case 'remote': return '🏠';
      case 'hybrid': return '🏢';
      case 'on-site': return '🏬';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Job Opportunities</h1>
          <p className="mt-2 text-gray-300">
            Discover your next career opportunity
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 flex items-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={filters.location || ''}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Mode</label>
                  <select
                    value={filters.workMode || ''}
                    onChange={(e) => setFilters({...filters, workMode: e.target.value as WorkMode})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                  >
                    <option value="">Any</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                  <select
                    value={filters.jobType || ''}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value as JobType})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                  >
                    <option value="">Any</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <select
                    value={filters.experienceLevel || ''}
                    onChange={(e) => setFilters({...filters, experienceLevel: e.target.value as ExperienceLevel})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                  >
                    <option value="">Any</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Salary</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={filters.salaryMin || ''}
                    onChange={(e) => setFilters({...filters, salaryMin: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setFilters({})}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 mr-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <p className="text-gray-300">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6 hover:bg-gray-750 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-semibold text-white mb-1 hover:text-blue-400 cursor-pointer transition-colors">{job.title}</h3>
                      </Link>
                      <div className="flex items-center text-blue-400 mb-2">
                        <Building className="w-4 h-4 mr-1" />
                        <Link href={`/company/${job.companyId}`} className="hover:text-blue-300 transition-colors">
                          {job.company}
                        </Link>
                        {job.recruiterId && <span className="text-gray-400 ml-2">(via recruiter)</span>}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.experienceLevel}
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

                  <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="text-xs text-gray-400">+{job.skills.length - 5} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicationsCount} applicants
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      {job.applicationDeadline && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Apply Now
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
