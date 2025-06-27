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
  isAdmin?: boolean;
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

export interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  capacity: number;
  startDate: string;
  endDate: string;
  location: string;
  instructor: string;
  isReleased: boolean;
  createdAt: string;
  createdBy: string;
  registrations: TrainingRegistration[];
}

export interface TrainingRegistration {
  id: string;
  trainingId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  registeredAt: string;
  approvedAt?: string;
  completedAt?: string;
  notes?: string;
}