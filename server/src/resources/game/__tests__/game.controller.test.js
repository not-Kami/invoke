import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'

// Mock du modèle Game
const mockGameModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn()
}

// Mock du module
jest.unstable_mockModule('../game.model.js', () => ({
  default: mockGameModel
}))

const mockGame = {
  _id: 'game-1',
  name: 'Test Game',
  description: 'A test game',
  genre: 'RPG',
  system: 'Test System',
  featured: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Game Controller', () => {
  let mockReq, mockRes

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    }
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    
    // Reset des mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('createGame', () => {
    it('should create a new game successfully', async () => {
      const gameData = {
        name: 'New Game',
        description: 'A new game',
        genre: 'RPG',
        system: 'New System'
      }
      
      mockReq.body = gameData
      mockGameModel.create.mockResolvedValue(mockGame)

      const { createGame } = await import('../game.controller.js')
      await createGame(mockReq, mockRes)

      expect(mockGameModel.create).toHaveBeenCalledWith(gameData)
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith(mockGame)
    })

    it('should handle creation errors', async () => {
      const error = new Error('Database error')
      mockGameModel.create.mockRejectedValue(error)

      const { createGame } = await import('../game.controller.js')
      await createGame(mockReq, mockRes)

      expect(mockGameModel.create).toHaveBeenCalledWith(mockReq.body)
      expect(mockRes.status).toHaveBeenCalledWith(500)
    })
  })

  describe('getGames', () => {
    it('should fetch games with default pagination', async () => {
      const games = [mockGame]
      mockGameModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(games)
              })
            })
          })
        })
      })
      
      mockGameModel.countDocuments.mockResolvedValue(1)

      const { getGames } = await import('../game.controller.js')
      await getGames(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: games.map(game => ({ ...game, featured: game.featured !== undefined ? game.featured : false })),
        page: 1,
        limit: 10,
        total: 1
      })
    })

    it('should handle search query', async () => {
      mockReq.query = { q: 'test' }
      
      const games = [mockGame]
      mockGameModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(games)
              })
            })
          })
        })
      })
      
      mockGameModel.countDocuments.mockResolvedValue(1)

      const { getGames } = await import('../game.controller.js')
      await getGames(mockReq, mockRes)

      expect(mockGameModel.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } }
        ]
      })
    })

    it('should handle filtering by genre and system', async () => {
      mockReq.query = { genre: 'RPG', system: 'D&D' }
      
      const games = [mockGame]
      mockGameModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(games)
              })
            })
          })
        })
      })
      
      mockGameModel.countDocuments.mockResolvedValue(1)

      const { getGames } = await import('../game.controller.js')
      await getGames(mockReq, mockRes)

      expect(mockGameModel.find).toHaveBeenCalledWith({
        genre: 'RPG',
        system: 'D&D'
      })
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error')
      mockGameModel.find.mockRejectedValue(error)

      const { getGames } = await import('../game.controller.js')
      await getGames(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch games',
        error: error.message
      })
    })
  })

  describe('getGame', () => {
    it('should fetch a game by ID', async () => {
      mockReq.params.id = 'game-1'
      mockGameModel.findById.mockResolvedValue(mockGame)

      const { getGame } = await import('../game.controller.js')
      await getGame(mockReq, mockRes)

      expect(mockGameModel.findById).toHaveBeenCalledWith('game-1')
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockGame)
    })
  })

  describe('updateGame', () => {
    it('should update a game successfully', async () => {
      const updateData = { name: 'Updated Game' }
      mockReq.params.id = 'game-1'
      mockReq.body = updateData
      
      mockGameModel.findByIdAndUpdate.mockResolvedValue({ ...mockGame, ...updateData })

      const { updateGame } = await import('../game.controller.js')
      await updateGame(mockReq, mockRes)

      expect(mockGameModel.findByIdAndUpdate).toHaveBeenCalledWith('game-1', updateData, { new: true })
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { ...mockGame, ...updateData }
      })
    })

    it('should handle game not found', async () => {
      mockReq.params.id = 'invalid-id'
      mockReq.body = { name: 'Updated Game' }
      
      mockGameModel.findByIdAndUpdate.mockResolvedValue(null)

      const { updateGame } = await import('../game.controller.js')
      await updateGame(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Game not found'
      })
    })

    it('should handle update errors', async () => {
      const error = new Error('Update error')
      mockReq.params.id = 'game-1'
      mockReq.body = { name: 'Updated Game' }
      
      mockGameModel.findByIdAndUpdate.mockRejectedValue(error)

      const { updateGame } = await import('../game.controller.js')
      await updateGame(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update game',
        error: error.message
      })
    })
  })

  describe('deleteGame', () => {
    it('should delete a game successfully', async () => {
      mockReq.params.id = 'game-1'
      mockGameModel.findByIdAndDelete.mockResolvedValue(mockGame)

      const { deleteGame } = await import('../game.controller.js')
      await deleteGame(mockReq, mockRes)

      expect(mockGameModel.findByIdAndDelete).toHaveBeenCalledWith('game-1')
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockGame)
    })
  })

  describe('getFeaturedGames', () => {
    it('should fetch featured games successfully', async () => {
      const featuredGames = [mockGame]
      mockGameModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(featuredGames)
        })
      })

      const { getFeaturedGames } = await import('../game.controller.js')
      await getFeaturedGames(mockReq, mockRes)

      expect(mockGameModel.find).toHaveBeenCalledWith({ featured: true })
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: featuredGames
      })
    })

    it('should handle errors in featured games', async () => {
      const error = new Error('Database error')
      mockGameModel.find.mockRejectedValue(error)

      const { getFeaturedGames } = await import('../game.controller.js')
      await getFeaturedGames(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch featured games',
        error: error.message
      })
    })
  })
})
