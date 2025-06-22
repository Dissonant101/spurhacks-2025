'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { JobType, ExperienceLevel, WorkMode } from '@/types';
import { 
  Save, 
  Eye, 
  Plus, 
  X, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign,
  Award,
  Gift,
  FileText,
  Users
} from 'lucide-react';

export default function PostJob() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    workMode: 'hybrid' as WorkMode,
    jobType: 'full-time' as JobType,
    experienceLevel: 'mid' as ExperienceLevel,
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    applicationDeadline: '',
    requirements: [''],
    skills: [''],
    benefits: [''],
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user && user.accountType === 'user') {
      // Redirect users to jobs page if they try to access post-job
      router.push('/jobs');
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

  if (!user || user.accountType === 'user') return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (index: number, value: string, field: 'requirements' | 'skills' | 'benefits') => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'skills' | 'benefits') => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'requirements' | 'skills' | 'benefits') => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!jobData.title || !jobData.description || !jobData.location) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Filter out empty array items
    const cleanedData = {
      ...jobData,
      requirements: jobData.requirements.filter(item => item.trim()),
      skills: jobData.skills.filter(item => item.trim()),
      benefits: jobData.benefits.filter(item => item.trim()),
    };

    // In a real app, this would make an API call
    console.log('Job posting data:', cleanedData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Job posted successfully!');
      router.push('/jobs');
    }, 1000);
  };

  const getCompanyName = () => {
    // Get company name from user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: any) => u.id === user.id);
    return currentUser?.companyName || currentUser?.agencyName || 'Your Company';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
          <p className="mt-2 text-gray-300">
            Find the perfect candidate for your team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Job Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={jobData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                        Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={jobData.location}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="workMode" className="block text-sm font-medium text-gray-300 mb-2">
                        Work Mode
                      </label>
                      <select
                        id="workMode"
                        name="workMode"
                        value={jobData.workMode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="on-site">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-2">
                        Job Type
                      </label>
                      <select
                        id="jobType"
                        name="jobType"
                        value={jobData.jobType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300 mb-2">
                        Experience Level
                      </label>
                      <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={jobData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-300 mb-2">
                      Application Deadline
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="applicationDeadline"
                        name="applicationDeadline"
                        type="date"
                        value={jobData.applicationDeadline}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Compensation
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Salary
                    </label>
                    <input
                      id="salaryMin"
                      name="salaryMin"
                      type="number"
                      value={jobData.salaryMin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Salary
                    </label>
                    <input
                      id="salaryMax"
                      name="salaryMax"
                      type="number"
                      value={jobData.salaryMax}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="120000"
                    />
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={jobData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Requirements
                </h2>
                
                <div className="space-y-3">
                  {jobData.requirements.map((requirement, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleArrayInput(index, e.target.value, 'requirements')}
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 3+ years of React experience"
                      />
                      {jobData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'requirements')}
                          className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="flex items-center px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Required Skills
                </h2>
                
                <div className="space-y-3">
                  {jobData.skills.map((skill, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayInput(index, e.target.value, 'skills')}
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., JavaScript"
                      />
                      {jobData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'skills')}
                          className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="flex items-center px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Benefits & Perks
                </h2>
                
                <div className="space-y-3">
                  {jobData.benefits.map((benefit, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayInput(index, e.target.value, 'benefits')}
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Health Insurance"
                      />
                      {jobData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'benefits')}
                          className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('benefits')}
                    className="flex items-center px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Post Job
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Job Preview</h3>
                {jobData.title ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white">{jobData.title}</h4>
                      <p className="text-blue-400">{getCompanyName()}</p>
                    </div>
                    
                    {jobData.location && (
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {jobData.location} • {jobData.workMode} • {jobData.jobType}
                      </div>
                    )}
                    
                    {(jobData.salaryMin || jobData.salaryMax) && (
                      <div className="text-green-400 font-semibold">
                        {jobData.salaryMin && jobData.salaryMax ? 
                          `$${parseInt(jobData.salaryMin).toLocaleString()} - $${parseInt(jobData.salaryMax).toLocaleString()} ${jobData.currency}` :
                          jobData.salaryMin ? 
                            `From $${parseInt(jobData.salaryMin).toLocaleString()} ${jobData.currency}` :
                            `Up to $${parseInt(jobData.salaryMax).toLocaleString()} ${jobData.currency}`
                        }
                      </div>
                    )}
                    
                    {jobData.description && (
                      <p className="text-gray-300 text-sm line-clamp-3">{jobData.description}</p>
                    )}
                    
                    {jobData.skills.filter(s => s.trim()).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {jobData.skills.filter(s => s.trim()).slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Fill in the job details to see a preview</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
