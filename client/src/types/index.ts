export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isDM: boolean;
  featured: boolean;
  avatar: string | null;
  bio: string | null;
  nickname?: string;
  favorite_games: string[];
  mastered_games: string[];
  evaluations: string[];
  sessionsCreated: string[];
  sessionsJoined: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  name: string;
  description: string;
  genre: string;
  system: string;
  images: {
    logo?: string;
    portrait?: string;
    banner?: string;
  };
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  _id: string;
  title: string;
  description: string;
  date: string;
  timezone: string;
  sessionType: 'online' | 'offline';
  isOneShot: boolean;
  game: string | Game;
  dm: string | User;
  players: string[] | User[];
  maxPlayers: number;
  status: 'open' | 'full' | 'finished' | 'cancelled';
  image: string | null;
  featured: boolean;
  estimatedDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  game: string | Game;
  dm: string | User;
  players: string[] | User[];
  sessions: string[] | Session[];
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  _id: string;
  user: string;
  name: string;
  avatar?: string;
  meta: Record<string, any>;
  sessions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  conversationType: 'contact_admin' | 'user_chat';
  userEmail?: string;
  userName?: string;
  participants: string[] | User[];
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: Array<{
    content: string;
    timestamp: string;
    sender: string | User;
    senderType: 'user' | 'admin';
    isRead: boolean;
  }>;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
  lastMessageAt: string;
  assignedTo?: string | User;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  _id: string;
  author: User;
  rating: number;
  comment?: string;
  target?: User;
  session?: Session;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface PopulatedSession extends Omit<Session, 'game' | 'dm' | 'players'> {
  game: Game;
  dm: User;
  players: User[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Table {
  _id: string;
  name: string;
  description: string;
  owner: string | User;
  members: TableMember[];
  isPrivate: boolean;
  tags: string[];
  avatar: string | null;
  pendingInvitations: PendingInvitation[];
  preferences: TablePreferences;
  stats: TableStats;
  status: 'active' | 'inactive' | 'archived';
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TableMember {
  user: string | User;
  joinedAt: string;
}

export interface PendingInvitation {
  user: string | User;
  invitedAt: string;
  expiresAt: string;
}

export interface TablePreferences {
  preferredGames: string[] | Game[];
  timezone: string;
  sessionTypes: ('online' | 'offline')[];
  availability: {
    weekdays: string[];
    timeSlots: {
      start: string;
      end: string;
    }[];
  };
}

export interface TableStats {
  sessionsPlayed: number;
  totalPlayTime: number;
  averageRating: number;
}

export interface PopulatedTable extends Omit<Table, 'owner' | 'members' | 'pendingInvitations' | 'preferences'> {
  owner: User;
  members: Array<{
    user: User;
    status: 'ACTIVE' | 'INVITED';
    joinedAt: string;
  }>;
  pendingInvitations: Array<{
    user: User;
    invitedAt: string;
    expiresAt: string;
  }>;
  preferences: {
    preferredGames: Game[];
    timezone: string;
    sessionTypes: ('online' | 'offline')[];
    availability: {
      weekdays: string[];
      timeSlots: {
        start: string;
        end: string;
      }[];
    };
  };
}