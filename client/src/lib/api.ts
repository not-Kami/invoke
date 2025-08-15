// Types pour les réponses API

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Types pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isDM: boolean;
  featured: boolean;
  avatar?: string | null;
  bio?: string;
  nickname?: string;
  favorite_games?: any[];
  mastered_games?: any[];
  evaluations?: any[];
  createdAt: string;
  updatedAt: string;
}

interface Session {
  _id: string;
  title: string;
  description: string;
  date: string;
  timezone: string;
  sessionType: 'online' | 'offline';
  isOneShot: boolean;
  game: string; // ID du jeu
  dm: string; // ID du DM
  players: string[]; // IDs des joueurs
  maxPlayers: number;
  status: 'open' | 'full' | 'finished' | 'cancelled';
  featured: boolean;
  image?: string; // URL de l'image
  createdAt: string;
  updatedAt: string;
}

interface Campaign {
  _id: string;
  title: string;
  game: string;
  dm: string;
  status: 'active' | 'paused' | 'completed';
  players: number;
  maxPlayers: number;
  featured: boolean;
  createdAt: string;
}

interface Game {
  _id: string;
  name: string;
  description: string;
  genre: string;
  system: string;
  image?: string; // Nom du fichier ou URL (pour compatibilité)
  images?: {
    logo?: string | File;
    portrait?: string | File;
    banner?: string | File;
  }; // Structure pour GameModal
  featured: boolean;
  sessionsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// Type pour les conversations
export interface Conversation {
  _id: string;
  conversationType: 'contact_admin' | 'user_chat';
  userEmail: string;
  participants: string[];
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: Array<{
    _id: string;
    content: string;
    timestamp: string;
    sender: string;
    senderType: 'user' | 'admin';
    isRead: boolean;
  }>;
  metadata: {
    userAgent: string;
    ipAddress: string;
    referrer: string | null;
  };
  lastMessageAt: string;
  assignedTo: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  isUnread: boolean;
}

// Fonction utilitaire pour les appels API
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log('API Debug - Making request to:', `${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Inclure les cookies dans les requêtes
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }

    // Normalisation des réponses : si l'API retourne directement un tableau ou un objet
    // on le transforme en format standard { success: true, data: ... }
    if (Array.isArray(data)) {
      return {
        success: true,
        data: data as T
      };
    }
    
    // Si c'est déjà au bon format, on le retourne tel quel
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }
    
    // Sinon, on normalise
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

// ===== ENDPOINTS ADMIN =====

// Users
export const adminAPI = {
  // Récupérer tous les utilisateurs
  getUsers: () => apiCall<User[]>('/users'),
  
  // Récupérer les MJ mis en avant
  getFeaturedDMs: () => apiCall<User[]>('/users/featured-dms'),
  
  // Mettre à jour un utilisateur
  updateUser: (id: string, data: Partial<User>) => 
    apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  // Fonction admin pour mettre à jour le statut featured
  adminUpdateUserFeatured: (id: string, featured: boolean) => 
    apiCall<User>(`/users/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    }),
  
  // Supprimer un utilisateur
  deleteUser: (id: string) => 
    apiCall(`/users/${id}`, { method: 'DELETE' }),

  // Sessions
  getSessions: (filters?: {
    search?: string;
    sessionType?: 'online' | 'offline';
    status?: 'open' | 'full' | 'finished' | 'cancelled';
    game?: string;
    dm?: string;
    page?: number;
    limit?: number;
    showFinished?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('q', filters.search); // Le serveur attend 'q' pas 'search'
    if (filters?.sessionType) params.append('sessionType', filters.sessionType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.game) params.append('game', filters.game);
    if (filters?.dm) params.append('dm', filters.dm);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.showFinished) params.append('showFinished', 'true');
    
    const queryString = params.toString();
    const endpoint = queryString ? `/sessions?${queryString}` : '/sessions';
    return apiCall<{ data: Session[]; page: number; limit: number; total: number }>(endpoint);
  },
  getSession: (id: string) => apiCall<Session>(`/sessions/${id}`),
  createSession: (data: Partial<Session>) => 
    apiCall<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  invitePlayer: (sessionId: string, playerId: string) => 
    apiCall<Session>(`/sessions/${sessionId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    }),
  removePlayer: (sessionId: string, playerId: string) => 
    apiCall<Session>(`/sessions/${sessionId}/remove-player`, {
      method: 'DELETE',
      body: JSON.stringify({ playerId }),
    }),
  joinSession: (sessionId: string) => 
    apiCall<Session>(`/sessions/${sessionId}/join`, {
      method: 'POST',
    }),
  getFeaturedSessions: () => apiCall<Session[]>('/sessions/featured'),
  updateSession: (id: string, data: Partial<Session>) => 
    apiCall<Session>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  // Fonction admin pour mettre à jour le statut featured
  adminUpdateSessionFeatured: (id: string, featured: boolean) => 
    apiCall<Session>(`/sessions/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    }),
  deleteSession: (id: string) => 
    apiCall(`/sessions/${id}`, { method: 'DELETE' }),

  // Games
  getGames: () => apiCall<Game[]>('/games'),
  getFeaturedGames: () => apiCall<Game[]>('/games/featured'),
  createGame: (data: Partial<Game>) => 
    apiCall<Game>('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateGame: (id: string, data: Partial<Game>) => 
    apiCall<Game>(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteGame: (id: string) => 
    apiCall(`/games/${id}`, { method: 'DELETE' }),

  // Campaigns
  getCampaigns: () => apiCall<Campaign[]>('/campaigns'),
  getFeaturedCampaigns: () => apiCall<Campaign[]>('/campaigns/featured'),
  updateCampaign: (id: string, data: Partial<Campaign>) => 
    apiCall<Campaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCampaign: (id: string) => 
    apiCall(`/campaigns/${id}`, { method: 'DELETE' }),

  // Conversations
  getConversations: () => apiCall<Conversation[]>('/conversations'),
  getConversation: (id: string) => apiCall<Conversation>(`/conversations/${id}`),
  createContactAdmin: (data: {
    userEmail: string;
    content: string;
    conversationType: string;
    subject: string;
    userName?: string;
  }) => 
    apiCall<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateConversation: (id: string, data: Partial<Conversation>) => 
    apiCall<Conversation>(`/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteConversation: (id: string) => 
    apiCall(`/conversations/${id}`, { method: 'DELETE' }),
  archiveConversation: (id: string) => 
    apiCall<Conversation>(`/conversations/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'closed' }),
    }),
  replyToConversation: (id: string, content: string) => 
    apiCall<Conversation>(`/conversations/${id}/admin-reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// ===== USERS API =====
export const usersApi = {
  // Profil de base
  getProfile: (userId: string) => 
    apiCall<User>(`/users/${userId}`),
  updateProfile: (userId: string, data: Partial<User>) => 
    apiCall<User>(`/users/${userId}/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  
  // Rôle utilisateur
  updateRole: (userId: string, role: string) => 
    apiCall<User>(`/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  
  // Jeux favoris
  getFavorites: (userId: string) => 
    apiCall<Game[]>(`/users/${userId}/favorites`),
  addFavorite: (userId: string, gameId: string) => 
    apiCall<User>(`/users/${userId}/favorites`, { method: 'POST', body: JSON.stringify({ gameId }) }),
  removeFavorite: (userId: string, gameId: string) => 
    apiCall<User>(`/users/${userId}/favorites/${gameId}`, { method: 'DELETE' }),
  
  // Évaluations
  getEvaluations: (userId: string) => 
    apiCall<any[]>(`/users/${userId}/evaluations`),
  addEvaluation: (userId: string, data: any) => 
    apiCall<any>(`/users/${userId}/evaluations`, { method: 'POST', body: JSON.stringify(data) }),
  updateEvaluation: (userId: string, evaluationId: string, data: any) => 
    apiCall<any>(`/users/${userId}/evaluations/${evaluationId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvaluation: (userId: string, evaluationId: string) => 
    apiCall(`/users/${userId}/evaluations/${evaluationId}`, { method: 'DELETE' }),
};

// ===== CONVERSATIONS API =====
export const conversationsApi = {
  // Créer une nouvelle conversation (contact admin)
  createContactAdmin: (data: {
    userEmail: string;
    content: string;
    conversationType: string;
    subject: string;
    userName?: string;
  }) => 
    apiCall<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Récupérer les conversations de l'utilisateur connecté
  getUserConversations: () => 
    apiCall<Conversation[]>('/conversations/user'),

  // Récupérer les conversations d'un utilisateur spécifique (par ID)
  getUserConversationsById: (userId: string) => 
    apiCall<{ data: Conversation[]; user: { _id: string; email: string; firstName: string; lastName: string } }>(`/conversations/user/${userId}`),

  // Récupérer une conversation spécifique
  getConversation: (conversationId: string) => 
    apiCall<Conversation>(`/conversations/${conversationId}`),

  // Ajouter un message à une conversation
  addMessage: (conversationId: string, message: string) => 
    apiCall<Conversation>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    }),

  // Marquer une conversation comme lue
  markAsRead: (conversationId: string) => 
    apiCall<Conversation>(`/conversations/${conversationId}/read`, {
      method: 'PATCH',
    }),

  // Fermer une conversation
  closeConversation: (conversationId: string) => 
    apiCall<Conversation>(`/conversations/${conversationId}/close`, {
      method: 'PATCH',
    }),
};

// ===== ENDPOINTS AUTH =====

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isDM?: boolean;
  avatar?: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  error?: string;
}

export const authAPI = {
  login: (data: LoginData) => 
    apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  signup: (data: SignupData) => 
    apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getCurrentUser: () => apiCall<{ user: User }>('/auth/me'),
  
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

// ===== ENDPOINTS PUBLIC =====

export const publicAPI = {
  getFeaturedSessions: () => apiCall<Session[]>('/sessions/featured'),
  getSession: (id: string) => apiCall<Session>(`/sessions/${id}`),
  getFeaturedGames: () => apiCall<Game[]>('/games/featured'),
  getGames: () => apiCall<Game[]>('/games'), // API publique pour tous les jeux
  getFeaturedDMs: () => apiCall<User[]>('/users/featured-dms'),
};

export type { User, Session, Campaign, Game, ApiResponse };