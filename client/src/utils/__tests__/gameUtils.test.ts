import { describe, it, expect } from 'vitest'
import { createTestGame } from '@/test/utils'

describe('Game Utils', () => {
  const mockGames = [
    createTestGame({
      _id: 'game-1',
      name: 'Dungeons & Dragons',
      genre: 'Fantasy',
      system: 'D&D 5e',
      featured: true
    }),
    createTestGame({
      _id: 'game-2',
      name: 'Pathfinder',
      genre: 'Fantasy',
      system: 'Pathfinder 2e',
      featured: false
    }),
    createTestGame({
      _id: 'game-3',
      name: 'Call of Cthulhu',
      genre: 'Horror',
      system: 'CoC 7e',
      featured: true
    })
  ]

  describe('Game Filtering', () => {
    it('should filter games by genre', () => {
      const fantasyGames = mockGames.filter(game => game.genre === 'Fantasy')
      
      expect(fantasyGames).toHaveLength(2)
      expect(fantasyGames[0].name).toBe('Dungeons & Dragons')
      expect(fantasyGames[1].name).toBe('Pathfinder')
    })

    it('should filter games by system', () => {
      const dndGames = mockGames.filter(game => game.system === 'D&D 5e')
      
      expect(dndGames).toHaveLength(1)
      expect(dndGames[0].name).toBe('Dungeons & Dragons')
    })

    it('should filter featured games', () => {
      const featuredGames = mockGames.filter(game => game.featured)
      
      expect(featuredGames).toHaveLength(2)
      expect(featuredGames[0].name).toBe('Dungeons & Dragons')
      expect(featuredGames[1].name).toBe('Call of Cthulhu')
    })
  })

  describe('Game Search', () => {
    it('should find games by name (case insensitive)', () => {
      const searchTerm = 'dungeons'
      const foundGames = mockGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(foundGames).toHaveLength(1)
      expect(foundGames[0].name).toBe('Dungeons & Dragons')
    })

    it('should find games by partial name match', () => {
      const searchTerm = 'path'
      const foundGames = mockGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(foundGames).toHaveLength(1)
      expect(foundGames[0].name).toBe('Pathfinder')
    })

    it('should return empty array for no matches', () => {
      const searchTerm = 'nonexistent'
      const foundGames = mockGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(foundGames).toHaveLength(0)
    })
  })

  describe('Game Sorting', () => {
    it('should sort games alphabetically by name', () => {
      const sortedGames = [...mockGames].sort((a, b) => 
        a.name.localeCompare(b.name)
      )
      
      expect(sortedGames[0].name).toBe('Call of Cthulhu')
      expect(sortedGames[1].name).toBe('Dungeons & Dragons')
      expect(sortedGames[2].name).toBe('Pathfinder')
    })

    it('should sort games by featured status (featured first)', () => {
      const sortedGames = [...mockGames].sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
      
      expect(sortedGames[0].featured).toBe(true)
      expect(sortedGames[1].featured).toBe(true)
      expect(sortedGames[2].featured).toBe(false)
    })
  })

  describe('Game Validation', () => {
    it('should validate game has required fields', () => {
      const validGame = createTestGame({
        _id: 'valid-game',
        name: 'Valid Game',
        description: 'A valid game',
        genre: 'RPG',
        system: 'Valid System'
      })
      
      expect(validGame._id).toBeDefined()
      expect(validGame.name).toBeDefined()
      expect(validGame.description).toBeDefined()
      expect(validGame.genre).toBeDefined()
      expect(validGame.system).toBeDefined()
    })

    it('should handle games with missing optional fields', () => {
      const minimalGame = createTestGame({
        _id: 'minimal-game',
        name: 'Minimal Game',
        description: 'A minimal game',
        genre: 'RPG',
        system: 'Minimal System'
      })
      
      // Supprimer les champs optionnels
      delete minimalGame.images
      delete minimalGame.createdAt
      delete minimalGame.updatedAt
      
      expect(minimalGame._id).toBeDefined()
      expect(minimalGame.name).toBeDefined()
      expect(minimalGame.description).toBeDefined()
      expect(minimalGame.genre).toBeDefined()
      expect(minimalGame.system).toBeDefined()
    })
  })

  describe('Game Statistics', () => {
    it('should count games by genre', () => {
      const genreCount = mockGames.reduce((acc, game) => {
        acc[game.genre] = (acc[game.genre] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      expect(genreCount['Fantasy']).toBe(2)
      expect(genreCount['Horror']).toBe(1)
    })

    it('should count featured vs non-featured games', () => {
      const featuredCount = mockGames.filter(game => game.featured).length
      const nonFeaturedCount = mockGames.filter(game => !game.featured).length
      
      expect(featuredCount).toBe(2)
      expect(nonFeaturedCount).toBe(1)
    })

    it('should count games by system', () => {
      const systemCount = mockGames.reduce((acc, game) => {
        acc[game.system] = (acc[game.system] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      expect(systemCount['D&D 5e']).toBe(1)
      expect(systemCount['Pathfinder 2e']).toBe(1)
      expect(systemCount['CoC 7e']).toBe(1)
    })
  })
})
