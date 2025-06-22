export type AccountType = 'user' | 'company' | 'recruiter';

export interface User {
  id: string;
  email: string;
  password?: string;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  connections: string[];
  // Company-specific fields
  companyName?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  // Recruiter-specific fields
  agencyName?: string;
  specializations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
  // Company-specific registration fields
  companyName?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  // Recruiter-specific registration fields
  agencyName?: string;
  specializations?: string[];
}

export interface Connection {
  id: string;
  user: User;
  connectedAt: Date;
  mutualConnections: number;
}

export interface SearchFilters {
  company?: string;
  position?: string;
  industry?: string;
  location?: string;
  skills?: string[];
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type WorkMode = 'remote' | 'hybrid' | 'on-site';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyId: string;
  recruiterId?: string; // If posted by a recruiter
  description: string;
  requirements: string[];
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  benefits: string[];
  applicationDeadline?: Date;
  isActive: boolean;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface JobFilters {
  location?: string;
  workMode?: WorkMode;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  skills?: string[];
  salaryMin?: number;
  company?: string;
}
