import { jest } from '@jest/globals'

// Mock des variables d'environnement
process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.MONGODB_URI = 'mongodb://localhost:27017/invoke-test'
process.env.JWT_SECRET = 'test-secret-key'
process.env.JWT_EXPIRES_IN = '1h'

// Mock de console.log pour les tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock de process.exit
process.exit = jest.fn()

// Mock de setTimeout et clearTimeout pour les tests
global.setTimeout = jest.fn((callback, delay) => {
  if (delay === 0) {
    callback()
  }
  return 1
})

global.clearTimeout = jest.fn()

// Mock de setInterval et clearInterval
global.setInterval = jest.fn(() => 1)
global.clearInterval = jest.fn()

// Mock de Date.now pour des tests prévisibles
const mockDate = new Date('2025-01-01T00:00:00.000Z')
global.Date.now = jest.fn(() => mockDate.getTime())

// Mock de Math.random pour des tests déterministes
global.Math.random = jest.fn(() => 0.5)
