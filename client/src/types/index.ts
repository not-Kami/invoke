export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isDM: boolean;
  avatar?: string;
  bio?: string;
  nickname?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  name: string;
  description: string;
  genre: string;
  system: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  _id: string;
  title: string;
  description: string;
  date: string;
  sessionType: 'online' | 'offline';
  isOneShot: boolean;
  game: Game;
  dm: User;
  players: User[];
  status: 'open' | 'full' | 'finished' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  game: Game;
  dm: User;
  players: User[];
  sessions: Session[];
  active: boolean;
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
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}