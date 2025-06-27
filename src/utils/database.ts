import { User, Post, Comment } from '../types';

const STORAGE_KEYS = {
  USERS: 'nab_users',
  POSTS: 'nab_posts',
  CURRENT_USER: 'nab_current_user'
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
        linkedIn: 'linkedin.com/in/sarahjohnson'
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
        location: 'Sydney, NSW'
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
  }
};