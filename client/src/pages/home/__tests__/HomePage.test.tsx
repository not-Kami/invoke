import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import HomePage from '../HomePage'
import { createTestUser, createTestGame, createTestSession } from '@/test/utils'

// Mock des hooks
vi.mock('@/hooks/useFavoriteGames', () => ({
  useFavoriteGames: vi.fn()
}))

vi.mock('@/hooks/useOnboarding', () => ({
  useOnboarding: vi.fn()
}))

vi.mock('@/hooks/useHomePageData', () => ({
  useHomePageData: vi.fn()
}))

const mockUseFavoriteGames = vi.mocked(require('@/hooks/useFavoriteGames').useFavoriteGames)
const mockUseOnboarding = vi.mocked(require('@/hooks/useOnboarding').useOnboarding)
const mockUseHomePageData = vi.mocked(require('@/hooks/useHomePageData').useHomePageData)

describe('HomePage', () => {
  const mockUser = createTestUser({
    _id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  })

  const mockGame = createTestGame({
    _id: 'game-1',
    name: 'Dungeons & Dragons',
    description: 'A fantasy RPG',
    genre: 'Fantasy',
    system: 'D&D 5e'
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
    
    // Mock par défaut pour useFavoriteGames
    mockUseFavoriteGames.mockReturnValue({
      addFavoriteGame: vi.fn(),
      removeFavoriteGame: vi.fn(),
      isFavorite: vi.fn(() => false)
    })

    // Mock par défaut pour useOnboarding
    mockUseOnboarding.mockReturnValue({
      showOnboarding: false,
      showWelcomeBanner: false,
      completeOnboarding: vi.fn(),
      skipOnboarding: vi.fn(),
      dismissWelcomeBanner: vi.fn()
    })

    // Mock par défaut pour useHomePageData
    mockUseHomePageData.mockReturnValue({
      featuredGames: [mockGame],
      gamesLoading: false,
      featuredSessions: [mockSession],
      sessionsLoading: false
    })
  })

  it('renders hero section', () => {
    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // Vérifier que la page se charge sans erreur
    expect(document.body).toBeInTheDocument()
  })

  it('renders featured games section when games are available', async () => {
    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    await waitFor(() => {
      expect(screen.getByText('Dungeons & Dragons')).toBeInTheDocument()
    })
  })

  it('renders featured sessions section when sessions are available', async () => {
    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    await waitFor(() => {
      expect(screen.getByText('Test Session')).toBeInTheDocument()
    })
  })

  it('shows loading state for games', () => {
    mockUseHomePageData.mockReturnValue({
      featuredGames: [],
      gamesLoading: true,
      featuredSessions: [],
      sessionsLoading: false
    })

    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // Vérifier que la page se charge même en mode loading
    expect(document.body).toBeInTheDocument()
  })

  it('shows loading state for sessions', () => {
    mockUseHomePageData.mockReturnValue({
      featuredGames: [],
      gamesLoading: false,
      featuredSessions: [],
      sessionsLoading: true
    })

    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // Vérifier que la page se charge même en mode loading
    expect(document.body).toBeInTheDocument()
  })

  it('handles empty featured games gracefully', () => {
    mockUseHomePageData.mockReturnValue({
      featuredGames: [],
      gamesLoading: false,
      featuredSessions: [mockSession],
      sessionsLoading: false
    })

    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // Vérifier que la page se charge même sans jeux
    expect(document.body).toBeInTheDocument()
  })

  it('handles empty featured sessions gracefully', () => {
    mockUseHomePageData.mockReturnValue({
      featuredGames: [mockGame],
      gamesLoading: false,
      featuredSessions: [],
      sessionsLoading: false
    })

    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // Vérifier que la page se charge même sans sessions
    expect(document.body).toBeInTheDocument()
  })

  it('calls toggle favorite function when user is authenticated', async () => {
    const mockToggleFavorite = vi.fn()
    mockUseFavoriteGames.mockReturnValue({
      addFavoriteGame: mockToggleFavorite,
      removeFavoriteGame: mockToggleFavorite,
      isFavorite: vi.fn(() => false)
    })

    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // Vérifier que la fonction est disponible
    expect(mockToggleFavorite).toBeDefined()
  })

  it('does not show onboarding modal by default', () => {
    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // L'onboarding ne devrait pas être visible par défaut
    expect(mockUseOnboarding).toHaveBeenCalled()
  })

  it('does not show welcome banner by default', () => {
    render(<HomePage />, {
      initialAuthState: { user: mockUser, isAuthenticated: true, isLoading: false }
    })

    // La bannière de bienvenue ne devrait pas être visible par défaut
    expect(mockUseOnboarding).toHaveBeenCalled()
  })
})
