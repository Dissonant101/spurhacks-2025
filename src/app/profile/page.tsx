'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { User, Education, WorkExperience } from '@/types';
import { 
  Edit, 
  Plus, 
  Save, 
  X, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Calendar,
  Award
} from 'lucide-react';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  });

  // Forms for adding new items
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [educationForm, setEducationForm] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const [workForm, setWorkForm] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      // Load user profile from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find((u: any) => u.id === user.id);
      if (currentUser) {
        setProfile(currentUser);
        setEditForm({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          bio: currentUser.bio || '',
        });
      }
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

  if (!user || !profile) return null;

  const updateProfile = (updates: Partial<User>) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      setProfile({ ...profile, ...updates });
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      bio: editForm.bio,
    });
    setIsEditing(false);
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      ...educationForm,
      startDate: new Date(educationForm.startDate),
      endDate: educationForm.endDate ? new Date(educationForm.endDate) : undefined,
    };
    updateProfile({
      education: [...profile.education, newEducation],
    });
    setEducationForm({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setShowEducationForm(false);
  };

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      ...workForm,
      startDate: new Date(workForm.startDate),
      endDate: workForm.endDate ? new Date(workForm.endDate) : undefined,
    };
    updateProfile({
      workExperience: [...profile.workExperience, newWork],
    });
    setWorkForm({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setShowWorkForm(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      updateProfile({
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill('');
      setShowSkillsForm(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateProfile({
      skills: profile.skills.filter(skill => skill !== skillToRemove),
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg shadow mb-6 border border-gray-700">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-lg font-bold"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-lg font-bold"
                          placeholder="Last Name"
                        />
                      </div>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded resize-none"
                        rows={3}
                        placeholder="Write a short bio..."
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-white">
                        {profile.firstName} {profile.lastName}
                      </h1>
                      <p className="text-gray-300 mt-1">{profile.bio || 'No bio added yet'}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </h2>
                <button
                  onClick={() => setShowEducationForm(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {showEducationForm && (
                <div className="mb-6 p-4 border border-gray-600 rounded-lg bg-gray-700">
                  <h3 className="font-medium mb-3 text-white">Add Education</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={educationForm.institution}
                      onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={educationForm.degree}
                        onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={educationForm.fieldOfStudy}
                        onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={educationForm.startDate}
                        onChange={(e) => setEducationForm({...educationForm, startDate: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                      <input
                        type="date"
                        value={educationForm.endDate}
                        onChange={(e) => setEducationForm({...educationForm, endDate: e.target.value})}
                        disabled={educationForm.current}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded disabled:bg-gray-700"
                      />
                    </div>
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={educationForm.current}
                        onChange={(e) => setEducationForm({...educationForm, current: e.target.checked})}
                        className="mr-2"
                      />
                      Currently studying here
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={addEducation}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowEducationForm(false)}
                        className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-medium text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-blue-400">{edu.institution}</p>
                    <p className="text-sm text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.startDate.toString().slice(0, 4)} - {edu.current ? 'Present' : edu.endDate?.toString().slice(0, 4)}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-gray-300 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
                {profile.education.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No education added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Work Experience
                </h2>
                <button
                  onClick={() => setShowWorkForm(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {showWorkForm && (
                <div className="mb-6 p-4 border border-gray-600 rounded-lg bg-gray-700">
                  <h3 className="font-medium mb-3 text-white">Add Work Experience</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={workForm.company}
                      onChange={(e) => setWorkForm({...workForm, company: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Position"
                        value={workForm.position}
                        onChange={(e) => setWorkForm({...workForm, position: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={workForm.location}
                        onChange={(e) => setWorkForm({...workForm, location: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={workForm.startDate}
                        onChange={(e) => setWorkForm({...workForm, startDate: e.target.value})}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                      />
                      <input
                        type="date"
                        value={workForm.endDate}
                        onChange={(e) => setWorkForm({...workForm, endDate: e.target.value})}
                        disabled={workForm.current}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded disabled:bg-gray-700"
                      />
                    </div>
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={workForm.current}
                        onChange={(e) => setWorkForm({...workForm, current: e.target.checked})}
                        className="mr-2"
                      />
                      Currently working here
                    </label>
                    <textarea
                      placeholder="Description"
                      value={workForm.description}
                      onChange={(e) => setWorkForm({...workForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={addWorkExperience}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowWorkForm(false)}
                        className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.workExperience.map((work) => (
                  <div key={work.id} className="border-l-4 border-green-400 pl-4">
                    <h3 className="font-medium text-white">{work.position}</h3>
                    <p className="text-green-400">{work.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {work.startDate.toString().slice(0, 4)} - {work.current ? 'Present' : work.endDate?.toString().slice(0, 4)}
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
                {profile.workExperience.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No work experience added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-800 rounded-lg shadow mt-6 border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skills
              </h2>
              <button
                onClick={() => setShowSkillsForm(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {showSkillsForm && (
              <div className="mb-6 p-4 border border-gray-600 rounded-lg bg-gray-700">
                <h3 className="font-medium mb-3 text-white">Add Skill</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowSkillsForm(false)}
                    className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm group hover:bg-blue-800 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                  title="Click to remove"
                >
                  {skill}
                  <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-gray-400 text-center py-4 w-full">No skills added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
