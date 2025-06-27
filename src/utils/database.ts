import { User, Post, Comment, Training, TrainingRegistration } from '../types';

const STORAGE_KEYS = {
  USERS: 'nab_users',
  POSTS: 'nab_posts',
  CURRENT_USER: 'nab_current_user',
  TRAININGS: 'nab_trainings',
  TRAINING_REGISTRATIONS: 'nab_training_registrations'
};

// Initialize with sample data if empty
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const sampleUsers: User[] = [
      {
        id: '1',
        email: 'sarah.johnson@nab.com.au',
        firstName: 'Sarah',
        lastName: 'Johnson',
        position: 'Senior Software Engineer',
        department: 'Technology',
        bio: 'Passionate about building scalable fintech solutions and mentoring junior developers.',
        joinDate: '2022-03-15',
        skills: ['React', 'Node.js', 'AWS', 'Python', 'Microservices'],
        certifications: [
          {
            id: '1',
            name: 'AWS Solutions Architect',
            issuer: 'Amazon Web Services',
            dateObtained: '2023-01-15',
            expiryDate: '2026-01-15',
            credentialId: 'AWS-SAA-123456',
            verified: true
          }
        ],
        experience: '8 years',
        location: 'Melbourne, VIC',
        phone: '+61 3 9xxx xxxx',
        linkedIn: 'linkedin.com/in/sarahjohnson',
        isAdmin: true
      },
      {
        id: '2',
        email: 'michael.chen@nab.com.au',
        firstName: 'Michael',
        lastName: 'Chen',
        position: 'Data Scientist',
        department: 'Analytics',
        bio: 'Leveraging machine learning to drive customer insights and business growth.',
        joinDate: '2021-09-20',
        skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'R'],
        certifications: [
          {
            id: '2',
            name: 'Certified Data Scientist',
            issuer: 'Microsoft',
            dateObtained: '2022-06-10',
            verified: true
          }
        ],
        experience: '5 years',
        location: 'Sydney, NSW',
        isAdmin: false
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    const samplePosts: Post[] = [
      {
        id: '1',
        userId: '1',
        content: 'Excited to share that I just completed my AWS Solutions Architect certification! Looking forward to implementing more cloud-native solutions.',
        type: 'certification',
        timestamp: new Date().toISOString(),
        likes: ['2'],
        comments: [
          {
            id: '1',
            userId: '2',
            content: 'Congratulations Sarah! Well deserved 🎉',
            timestamp: new Date().toISOString(),
            likes: []
          }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(samplePosts));
  }

  // Initialize training data
  if (!localStorage.getItem(STORAGE_KEYS.TRAININGS)) {
    const sampleTrainings: Training[] = [
      {
        id: '1',
        title: 'Advanced React Development',
        description: 'Learn advanced React patterns, hooks, and performance optimization techniques.',
        category: 'Development',
        duration: '2 days',
        capacity: 20,
        startDate: '2024-02-15',
        endDate: '2024-02-16',
        location: 'Melbourne Office - Training Room A',
        instructor: 'Sarah Johnson',
        isReleased: false,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        registrations: []
      },
      {
        id: '2',
        title: 'Cybersecurity Awareness',
        description: 'Essential cybersecurity training for all employees to protect company data.',
        category: 'Security',
        duration: '1 day',
        capacity: 50,
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        location: 'Virtual - Teams Meeting',
        instructor: 'Security Team',
        isReleased: true,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        registrations: []
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(sampleTrainings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRAINING_REGISTRATIONS)) {
    const sampleRegistrations: TrainingRegistration[] = [
      {
        id: '1',
        trainingId: '1',
        userId: '2',
        status: 'pending',
        registeredAt: new Date().toISOString(),
        notes: 'Interested in advanced React concepts'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TRAINING_REGISTRATIONS, JSON.stringify(sampleRegistrations));
  }
};

export const database = {
  // Users
  getUsers: (): User[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  createUser: (user: User): void => {
    const users = database.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = database.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },

  getUserById: (id: string): User | null => {
    const users = database.getUsers();
    return users.find(u => u.id === id) || null;
  },

  getUserByEmail: (email: string): User | null => {
    const users = database.getUsers();
    return users.find(u => u.email === email) || null;
  },

  // Posts
  getPosts: (): Post[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  },

  createPost: (post: Post): void => {
    const posts = database.getPosts();
    posts.unshift(post);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  updatePost: (postId: string, updates: Partial<Post>): void => {
    const posts = database.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }
  },

  // Authentication
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Training Management
  getTrainings: (): Training[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAININGS) || '[]');
  },

  createTraining: (training: Training): void => {
    const trainings = database.getTrainings();
    trainings.push(training);
    localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(trainings));
  },

  updateTraining: (trainingId: string, updates: Partial<Training>): void => {
    const trainings = database.getTrainings();
    const index = trainings.findIndex(t => t.id === trainingId);
    if (index !== -1) {
      trainings[index] = { ...trainings[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(trainings));
    }
  },

  getTrainingById: (id: string): Training | null => {
    const trainings = database.getTrainings();
    return trainings.find(t => t.id === id) || null;
  },

  releaseTraining: (trainingId: string): void => {
    database.updateTraining(trainingId, { isReleased: true });
  },

  // Training Registrations
  getTrainingRegistrations: (): TrainingRegistration[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAINING_REGISTRATIONS) || '[]');
  },

  createTrainingRegistration: (registration: TrainingRegistration): void => {
    const registrations = database.getTrainingRegistrations();
    registrations.push(registration);
    localStorage.setItem(STORAGE_KEYS.TRAINING_REGISTRATIONS, JSON.stringify(registrations));
  },

  updateTrainingRegistration: (registrationId: string, updates: Partial<TrainingRegistration>): void => {
    const registrations = database.getTrainingRegistrations();
    const index = registrations.findIndex(r => r.id === registrationId);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TRAINING_REGISTRATIONS, JSON.stringify(registrations));
    }
  },

  getRegistrationsByTraining: (trainingId: string): TrainingRegistration[] => {
    const registrations = database.getTrainingRegistrations();
    return registrations.filter(r => r.trainingId === trainingId);
  },

  getRegistrationsByUser: (userId: string): TrainingRegistration[] => {
    const registrations = database.getTrainingRegistrations();
    return registrations.filter(r => r.userId === userId);
  }
};