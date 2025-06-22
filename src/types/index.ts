export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  connections: string[];
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
