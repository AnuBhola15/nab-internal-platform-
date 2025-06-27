export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  bio: string;
  avatar?: string;
  joinDate: string;
  skills: string[];
  certifications: Certification[];
  experience: string;
  location: string;
  phone?: string;
  linkedIn?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
  credentialId?: string;
  verified: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  type: 'achievement' | 'certification' | 'general' | 'project';
  timestamp: string;
  likes: string[];
  comments: Comment[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}