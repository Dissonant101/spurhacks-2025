'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { JobPosting, WorkMode } from '@/types';
import { 
  ArrowLeft,
  MapPin, 
  Building, 
  Clock, 
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  Share2,
  Bookmark,
  Award,
  Gift,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export default function JobDetails() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [job, setJob] = useState<JobPosting | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeUrl: ''
  });

  // Mock job data (in a real app, this would come from an API)
  const mockJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc',
      companyId: '1',
      description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for creating amazing user experiences using React, TypeScript, and modern web technologies.\n\nIn this role, you will:\n• Develop and maintain high-quality web applications\n• Collaborate with designers and backend developers\n• Write clean, maintainable, and efficient code\n• Participate in code reviews and technical discussions\n• Mentor junior developers\n\nWe offer a collaborative environment where you can grow your skills and make a real impact on our products.',
      requirements: [
        '5+ years of experience with React and TypeScript',
        'Strong knowledge of modern JavaScript (ES6+)',
        'Experience with CSS preprocessors and responsive design', 
        'Familiarity with state management libraries (Redux, Zustand)',
        'Understanding of web performance optimization',
        'Experience with testing frameworks (Jest, React Testing Library)',
        'Strong problem-solving and communication skills'
      ],
      location: 'San Francisco, CA',
      workMode: 'hybrid',
      jobType: 'full-time',
      experienceLevel: 'senior',
      salaryRange: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      },
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Jest'],
      benefits: [
        'Comprehensive health, dental, and vision insurance',
        '401(k) with company matching',
        'Flexible work from home policy',
        'Stock options',
        '$2000 annual learning budget',
        'Unlimited PTO',
        'Free lunch and snacks',
        'State-of-the-art equipment'
      ],
      applicationDeadline: new Date('2025-07-15'),
      isActive: true,
      applicationsCount: 45,
      createdAt: new Date('2025-06-01'),
      updatedAt: new Date('2025-06-01')
    }
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (jobId) {
      // Find the job by ID (in a real app, this would be an API call)
      const foundJob = mockJobs.find(j => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        router.push('/jobs');
      }
    }
  }, [user, isLoading, router, jobId]);

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

  if (!user || !job) return null;

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

  const handleApply = () => {
    if (user.accountType !== 'user') {
      alert('Only individual users can apply for jobs');
      return;
    }
    setShowApplicationModal(true);
  };

  const submitApplication = () => {
    // In a real app, this would submit to an API
    console.log('Submitting application:', applicationData);
    setHasApplied(true);
    setShowApplicationModal(false);
    alert('Application submitted successfully!');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would save to the user's saved jobs
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this ${job.title} position at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
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
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                  <div className="flex items-center text-blue-400 mb-4">
                    <Building className="w-5 h-5 mr-2" />
                    <span className="text-xl">{job.company}</span>
                    {job.recruiterId && <span className="text-gray-400 ml-2">(via recruiter)</span>}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
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
                      {job.experienceLevel} level
                    </span>
                  </div>

                  <div className="text-green-400 font-semibold text-xl flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {formatSalary(job)}
                  </div>
                </div>

                <div className="flex flex-col space-y-3 mt-4 md:mt-0 md:ml-6">
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 flex items-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                      isSaved 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                <div className="flex items-center space-x-6">
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
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About this role</h2>
              <div className="text-gray-300 whitespace-pre-line">{job.description}</div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="text-blue-400 mr-3 mt-1">•</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-900 text-blue-200 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Benefits & Perks
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Apply Card */}
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ready to apply?</h3>
                
                {hasApplied ? (
                  <div className="text-center py-4">
                    <UserCheck className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-semibold">Application Submitted</p>
                    <p className="text-gray-400 text-sm mt-1">We'll be in touch soon!</p>
                  </div>
                ) : (
                  <>
                    {user.accountType === 'user' ? (
                      <button
                        onClick={handleApply}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Apply Now
                      </button>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">
                          Only individual users can apply for jobs
                        </p>
                      </div>
                    )}
                  </>
                )}

                {job.applicationDeadline && (
                  <p className="text-gray-400 text-sm mt-3 text-center">
                    Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Company Info */}
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About {job.company}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-300">Technology Company</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-300">201-1000 employees</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-300">San Francisco, CA</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">
                  View Company Profile
                </button>
              </div>

              {/* Similar Jobs */}
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white text-sm">Frontend Engineer</h4>
                    <p className="text-gray-400 text-xs">StartupXYZ • Remote</p>
                    <p className="text-green-400 text-xs">$100k - $140k</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white text-sm">React Developer</h4>
                    <p className="text-gray-400 text-xs">DataFlow Systems • Hybrid</p>
                    <p className="text-green-400 text-xs">$110k - $160k</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Apply for {job.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resume URL (optional)
                </label>
                <input
                  type="url"
                  value={applicationData.resumeUrl}
                  onChange={(e) => setApplicationData({...applicationData, resumeUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={submitApplication}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Submit Application
              </button>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
