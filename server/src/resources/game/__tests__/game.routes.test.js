import { jest, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Mock de l'application Express
let app
let mongoServer

// Mock des middlewares d'authentification
jest.unstable_mockModule('../../middlewares/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => next(),
  restrictTo: (...roles) => (req, res, next) => next()
}))

beforeAll(async () => {
  // Démarrer le serveur MongoDB en mémoire
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  // Connecter à la base de données de test
  await mongoose.connect(mongoUri)
  
  // Importer l'application après la connexion à la base de données
  const { default: expressApp } = await import('../../../app.js')
  app = expressApp
})

afterAll(async () => {
  // Nettoyer et fermer les connexions
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  // Nettoyer la base de données avant chaque test
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
})

describe('Game Routes', () => {
  const testGame = {
    name: 'Test Game',
    description: 'A test game for testing',
    genre: 'RPG',
    system: 'Test System',
    featured: true
  }

  describe('POST /api/v1/games', () => {
    it('should create a new game', async () => {
      const response = await request(app)
        .post('/api/v1/games')
        .send(testGame)
        .expect(201)

      expect(response.body).toHaveProperty('_id')
      expect(response.body.name).toBe(testGame.name)
      expect(response.body.description).toBe(testGame.description)
      expect(response.body.genre).toBe(testGame.genre)
      expect(response.body.system).toBe(testGame.system)
      expect(response.body.featured).toBe(testGame.featured)
    })

    it('should validate required fields', async () => {
      const invalidGame = {
        description: 'Missing name and genre'
      }

      const response = await request(app)
        .post('/api/v1/games')
        .send(invalidGame)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('GET /api/v1/games', () => {
    beforeEach(async () => {
      // Créer quelques jeux de test
      const games = [
        { ...testGame, name: 'Game 1' },
        { ...testGame, name: 'Game 2', genre: 'Strategy' },
        { ...testGame, name: 'Game 3', system: 'Different System' }
      ]

      for (const game of games) {
        await request(app)
          .post('/api/v1/games')
          .send(game)
      }
    })

    it('should fetch all games with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/games')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('page', 1)
      expect(response.body).toHaveProperty('limit', 10)
      expect(response.body).toHaveProperty('total')
      expect(response.body.data).toHaveLength(3)
    })

    it('should filter games by genre', async () => {
      const response = await request(app)
        .get('/api/v1/games?genre=RPG')
        .expect(200)

      expect(response.body.data).toHaveLength(2)
      expect(response.body.data.every(game => game.genre === 'RPG')).toBe(true)
    })

    it('should filter games by system', async () => {
      const response = await request(app)
        .get('/api/v1/games?system=Test System')
        .expect(200)

      expect(response.body.data).toHaveLength(2)
      expect(response.body.data.every(game => game.system === 'Test System')).toBe(true)
    })

    it('should search games by name or description', async () => {
      const response = await request(app)
        .get('/api/v1/games?q=Game')
        .expect(200)

      expect(response.body.data).toHaveLength(3)
    })

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/api/v1/games?page=1&limit=2')
        .expect(200)

      expect(response.body.data).toHaveLength(2)
      expect(response.body.page).toBe(1)
      expect(response.body.limit).toBe(2)
    })
  })

  describe('GET /api/v1/games/:id', () => {
    let gameId

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/games')
        .send(testGame)
      
      gameId = response.body._id
    })

    it('should fetch a game by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/games/${gameId}`)
        .expect(200)

      expect(response.body._id).toBe(gameId)
      expect(response.body.name).toBe(testGame.name)
    })

    it('should return 404 for non-existent game', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      await request(app)
        .get(`/api/v1/games/${fakeId}`)
        .expect(404)
    })

    it('should return 400 for invalid ID format', async () => {
      await request(app)
        .get('/api/v1/games/invalid-id')
        .expect(400)
    })
  })

  describe('PUT /api/v1/games/:id', () => {
    let gameId

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/games')
        .send(testGame)
      
      gameId = response.body._id
    })

    it('should update a game successfully', async () => {
      const updateData = {
        name: 'Updated Game Name',
        description: 'Updated description'
      }

      const response = await request(app)
        .put(`/api/v1/games/${gameId}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(updateData.name)
      expect(response.body.data.description).toBe(updateData.description)
    })

    it('should return 404 for non-existent game', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      await request(app)
        .put(`/api/v1/games/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404)
    })
  })

  describe('DELETE /api/v1/games/:id', () => {
    let gameId

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/games')
        .send(testGame)
      
      gameId = response.body._id
    })

    it('should delete a game successfully', async () => {
      await request(app)
        .delete(`/api/v1/games/${gameId}`)
        .expect(200)

      // Vérifier que le jeu a été supprimé
      await request(app)
        .get(`/api/v1/games/${gameId}`)
        .expect(404)
    })
  })

  describe('GET /api/v1/games/featured', () => {
    beforeEach(async () => {
      // Créer des jeux avec différents statuts featured
      const games = [
        { ...testGame, name: 'Featured Game 1', featured: true },
        { ...testGame, name: 'Featured Game 2', featured: true },
        { ...testGame, name: 'Non-Featured Game', featured: false }
      ]

      for (const game of games) {
        await request(app)
          .post('/api/v1/games')
          .send(game)
      }
    })

    it('should fetch only featured games', async () => {
      const response = await request(app)
        .get('/api/v1/games/featured')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data.every(game => game.featured)).toBe(true)
    })

    it('should limit featured games to 4', async () => {
      // Créer plus de jeux featured
      for (let i = 3; i <= 6; i++) {
        await request(app)
          .post('/api/v1/games')
          .send({ ...testGame, name: `Featured Game ${i}`, featured: true })
      }

      const response = await request(app)
        .get('/api/v1/games/featured')
        .expect(200)

      expect(response.body.data).toHaveLength(4)
    })
  })
})
