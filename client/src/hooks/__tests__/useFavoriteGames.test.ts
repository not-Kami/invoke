import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFavoriteGames } from '../useFavoriteGames'
import { createTestUser, createTestGame } from '@/test/utils'
import { usersApi } from '@/lib/api'

// Mock de l'API
vi.mock('@/lib/api', () => ({
  usersApi: {
    getFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }
}))

// Mock du contexte d'authentification
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

const mockUsersApi = vi.mocked(usersApi)

describe('useFavoriteGames', () => {
  const mockUser = createTestUser({
    _id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  })

  const mockGame = createTestGame({
    _id: 'game-1',
    name: 'Test Game',
    description: 'A test game',
    genre: 'RPG',
    system: 'Test System'
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock par défaut pour useAuth
    const { useAuth } = require('@/contexts/AuthContext')
    useAuth.mockReturnValue({ user: mockUser })
  })

  it('should fetch favorite games on mount', async () => {
    mockUsersApi.getFavorites.mockResolvedValue({
      success: true,
      data: [mockGame],
      error: null
    })

    const { result } = renderHook(() => useFavoriteGames())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.favoriteGames).toEqual([mockGame])
    expect(result.current.error).toBeNull()
    expect(mockUsersApi.getFavorites).toHaveBeenCalledWith(mockUser._id)
  })

  it('should handle API error when fetching favorites', async () => {
    mockUsersApi.getFavorites.mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to fetch'
    })

    const { result } = renderHook(() => useFavoriteGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.favoriteGames).toEqual([])
    expect(result.current.error).toBe('Failed to fetch')
  })

  it('should add favorite game successfully', async () => {
    mockUsersApi.getFavorites.mockResolvedValue({
      success: true,
      data: [],
      error: null
    })

    mockUsersApi.addFavorite.mockResolvedValue({
      success: true,
      data: [mockGame],
      error: null
    })

    const { result } = renderHook(() => useFavoriteGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await result.current.addFavoriteGame(mockGame)

    expect(mockUsersApi.addFavorite).toHaveBeenCalledWith(mockUser._id, mockGame._id)
    expect(result.current.favoriteGames).toEqual([mockGame])
  })

  it('should remove favorite game successfully', async () => {
    mockUsersApi.getFavorites.mockResolvedValue({
      success: true,
      data: [mockGame],
      error: null
    })

    mockUsersApi.removeFavorite.mockResolvedValue({
      success: true,
      data: [],
      error: null
    })

    const { result } = renderHook(() => useFavoriteGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await result.current.removeFavoriteGame(mockGame._id)

    expect(mockUsersApi.removeFavorite).toHaveBeenCalledWith(mockUser._id, mockGame._id)
    expect(result.current.favoriteGames).toEqual([])
  })

  it('should toggle favorite game correctly', async () => {
    mockUsersApi.getFavorites.mockResolvedValue({
      success: true,
      data: [],
      error: null
    })

    mockUsersApi.addFavorite.mockResolvedValue({
      success: true,
      data: [mockGame],
      error: null
    })

    const { result } = renderHook(() => useFavoriteGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Toggle on (add)
    result.current.toggleFavoriteGame(mockGame)

    await waitFor(() => {
      expect(mockUsersApi.addFavorite).toHaveBeenCalledWith(mockUser._id, mockGame._id)
    })

    // Toggle off (remove)
    mockUsersApi.removeFavorite.mockResolvedValue({
      success: true,
      data: [],
      error: null
    })

    result.current.toggleFavoriteGame(mockGame)

    await waitFor(() => {
      expect(mockUsersApi.removeFavorite).toHaveBeenCalledWith(mockUser._id, mockGame._id)
    })
  })

  it('should handle API errors gracefully', async () => {
    mockUsersApi.getFavorites.mockResolvedValue({
      success: true,
      data: [],
      error: null
    })

    mockUsersApi.addFavorite.mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to add favorite'
    })

    const { result } = renderHook(() => useFavoriteGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(result.current.addFavoriteGame(mockGame)).rejects.toThrow('Failed to add favorite')
  })

  it('should return empty array when user is not authenticated', async () => {
    const { useAuth } = require('@/contexts/AuthContext')
    useAuth.mockReturnValue({ user: null })

    const { result } = renderHook(() => useFavoriteGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.favoriteGames).toEqual([])
    expect(mockUsersApi.getFavorites).not.toHaveBeenCalled()
  })
})
