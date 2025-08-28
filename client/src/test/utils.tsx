import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { TestUser } from './types'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuthState?: {
    user: TestUser | null
    isAuthenticated: boolean
    isLoading: boolean
  }
  route?: string
}

const AllTheProviders: React.FC<{ children: React.ReactNode; authState: any }> = ({ 
  children, 
  authState 
}) => {
  return (
    <BrowserRouter>
      <AuthProvider initialAuthState={authState}>
        {children}
      </AuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    initialAuthState = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    },
    route = '/',
    ...renderOptions
  } = options

  // Set up route if provided
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route)
  }

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders authState={initialAuthState}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Helper function to create test data
export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: 'test-user-id',
  email: 'test@example.com',
  username: 'testuser',
  role: 'user',
  ...overrides,
})

export const createTestGame = (overrides: Partial<TestGame> = {}): TestGame => ({
  _id: 'test-game-id',
  name: 'Test Game',
  description: 'A test game for testing purposes',
  genre: 'RPG',
  system: 'Test System',
  featured: false,
  images: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createTestSession = (overrides: Partial<TestSession> = {}): TestSession => ({
  id: 'test-session-id',
  title: 'Test Session',
  description: 'A test session for testing purposes',
  gameId: 'test-game-id',
  dmId: 'test-dm-id',
  maxPlayers: 5,
  currentPlayers: 2,
  status: 'open',
  startDate: new Date().toISOString(),
  ...overrides,
})
