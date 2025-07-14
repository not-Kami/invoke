import axios from 'axios';
import { AuthResponse, User, Game, Session, Campaign, Character, Feedback } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => api.post<AuthResponse>('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => api.get<{ success: boolean; data: { user: User } }>('/auth/me'),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/update-password', data),
};

// Users API
export const usersApi = {
  getUsers: () => api.get<User[]>('/users'),
  getUser: (id: string) => api.get<User>(`/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Games API
export const gamesApi = {
  getGames: () => api.get<Game[]>('/games'),
  getGame: (id: string) => api.get<Game>(`/games/${id}`),
  createGame: (data: Omit<Game, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Game>('/games', data),
  updateGame: (id: string, data: Partial<Game>) => api.put<Game>(`/games/${id}`, data),
  deleteGame: (id: string) => api.delete(`/games/${id}`),
};

// Sessions API
export const sessionsApi = {
  getSessions: () => api.get<Session[]>('/sessions'),
  getSession: (id: string) => api.get<Session>(`/sessions/${id}`),
  createSession: (data: Omit<Session, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Session>('/sessions', data),
  updateSession: (id: string, data: Partial<Session>) =>
    api.put<Session>(`/sessions/${id}`, data),
  deleteSession: (id: string) => api.delete(`/sessions/${id}`),
};

// Campaigns API
export const campaignsApi = {
  getCampaigns: () => api.get<Campaign[]>('/campaigns'),
  getCampaign: (id: string) => api.get<Campaign>(`/campaigns/${id}`),
  createCampaign: (data: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Campaign>('/campaigns', data),
  updateCampaign: (id: string, data: Partial<Campaign>) =>
    api.put<Campaign>(`/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
};

// Characters API
export const charactersApi = {
  getMyCharacters: () => api.get<{ success: boolean; characters: Character[] }>('/characters'),
  getCharacter: (id: string) => api.get<{ success: boolean; character: Character }>(`/characters/${id}`),
  createCharacter: (data: { name: string; meta?: Record<string, any> }) =>
    api.post<{ success: boolean; character: Character }>('/characters', data),
  updateCharacter: (id: string, data: Partial<Character>) =>
    api.put<{ success: boolean; character: Character }>(`/characters/${id}`, data),
  deleteCharacter: (id: string) => api.delete(`/characters/${id}`),
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/characters/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Feedback API
export const feedbackApi = {
  getFeedback: () => api.get<Feedback[]>('/feedback'),
  getFeedbackById: (id: string) => api.get<Feedback>(`/feedback/${id}`),
  createFeedback: (data: Omit<Feedback, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Feedback>('/feedback', data),
  updateFeedback: (id: string, data: Partial<Feedback>) =>
    api.put<Feedback>(`/feedback/${id}`, data),
  deleteFeedback: (id: string) => api.delete(`/feedback/${id}`),
};

export default api;