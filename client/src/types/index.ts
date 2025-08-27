export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isDM: boolean;
  avatar?: string | null;
  bio?: string;
  nickname?: string;
  favorite_games?: string[]; // IDs des jeux favoris
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  name: string;
  description: string;
  genre: string;
  system: string;
  images?: {
    logo?: string;
    portrait?: string;
    banner?: string;
  };
  featured?: boolean; // Jeux mis en avant
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  _id: string;
  title: string;
  description: string;
  date: string;
  timezone?: string;
  sessionType: 'online' | 'offline';
  isOneShot: boolean;
  game: string | Game; // Peut être un ID ou un objet Game
  dm: string | User; // Peut être un ID ou un objet User
  players: string[] | User[]; // Peut être des IDs ou des objets User
  maxPlayers?: number;
  status: 'open' | 'full' | 'finished' | 'cancelled';
  image?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  title: string; // Changé de 'name' à 'title' pour correspondre à l'API
  description: string;
  game: string | Game; // Peut être un ID ou un objet Game
  dm: string | User; // Peut être un ID ou un objet User
  players: number; // Nombre de joueurs
  maxPlayers: number;
  status: 'active' | 'paused' | 'completed';
  featured?: boolean;
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