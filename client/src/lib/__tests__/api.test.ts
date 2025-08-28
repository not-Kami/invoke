import { describe, it, expect, vi, beforeEach } from 'vitest'
import { gamesApi, usersApi, sessionsApi } from '../api'
import { createTestGame, createTestUser, createTestSession } from '@/test/utils'

// Mock de fetch global
global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe('API Tests', () => {
  const mockGame = createTestGame({
    _id: 'game-1',
    name: 'Test Game',
    description: 'A test game',
    genre: 'RPG',
    system: 'Test System'
  })

  const mockUser = createTestUser({
    _id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  })

  const mockSession = createTestSession({
    _id: 'session-1',
    title: 'Test Session',
    description: 'A test session',
    gameId: 'game-1',
    dmId: 'dm-1',
    maxPlayers: 5,
    currentPlayers: 2,
    status: 'open'
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    mockFetch.mockClear()
  })

  describe('Games API', () => {
    it('should fetch all games successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockGame],
        message: 'Games fetched successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await gamesApi.getAll()

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/games'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should fetch featured games successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockGame],
        message: 'Featured games fetched successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await gamesApi.getFeatured()

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/games/featured'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should fetch game by ID successfully', async () => {
      const mockResponse = {
        success: true,
        data: mockGame,
        message: 'Game fetched successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await gamesApi.getById('game-1')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/games/game-1'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        success: false,
        error: 'Game not found',
        data: null
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await gamesApi.getById('invalid-id')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Game not found')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(gamesApi.getAll()).rejects.toThrow('Network error')
    })
  })

  describe('Users API', () => {
    it('should fetch user favorites successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockGame],
        message: 'Favorites fetched successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await usersApi.getFavorites('user-1')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/user-1/favorites'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should add favorite game successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockGame],
        message: 'Favorite added successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await usersApi.addFavorite('user-1', 'game-1')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/user-1/favorites'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ gameId: 'game-1' })
        })
      )
    })

    it('should remove favorite game successfully', async () => {
      const mockResponse = {
        success: true,
        data: [],
        message: 'Favorite removed successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await usersApi.removeFavorite('user-1', 'game-1')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/user-1/favorites/game-1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })

  describe('Sessions API', () => {
    it('should fetch all sessions successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockSession],
        message: 'Sessions fetched successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await sessionsApi.getAll()

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/sessions'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should fetch featured sessions successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockSession],
        message: 'Featured sessions fetched successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await sessionsApi.getFeatured()

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/sessions/featured'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should create session successfully', async () => {
      const sessionData = {
        title: 'New Session',
        description: 'A new session',
        gameId: 'game-1',
        dmId: 'dm-1',
        maxPlayers: 5
      }

      const mockResponse = {
        success: true,
        data: { ...mockSession, ...sessionData },
        message: 'Session created successfully'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await sessionsApi.create(sessionData)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/sessions'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(sessionData)
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response)

      await expect(gamesApi.getById('invalid-id')).rejects.toThrow('HTTP error! status: 404')
    })

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      } as Response)

      await expect(gamesApi.getAll()).rejects.toThrow('Invalid JSON')
    })
  })
})
