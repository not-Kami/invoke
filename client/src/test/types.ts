import { User } from '@/types'

export interface TestUser extends Partial<User> {
  id: string
  email: string
  username: string
  role?: 'user' | 'admin' | 'dm'
}

export interface TestGame {
  _id: string
  name: string
  description: string
  genre: string
  system: string
  featured: boolean
  images?: {
    logo?: string
    portrait?: string
    banner?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface TestSession {
  id: string
  title: string
  description: string
  gameId: string
  dmId: string
  maxPlayers: number
  currentPlayers: number
  status: 'open' | 'full' | 'in-progress' | 'completed'
  startDate: string
  endDate?: string
}

export interface TestCampaign {
  id: string
  title: string
  description: string
  gameId: string
  dmId: string
  players: string[]
  status: 'active' | 'paused' | 'completed'
}

export interface MockApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
