import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import GameCard from '../GameCard'
import { createTestGame } from '@/test/utils'

describe('GameCard', () => {
  const defaultGame = createTestGame({
    _id: 'game-1',
    name: 'Dungeons & Dragons',
    description: 'A fantasy tabletop role-playing game',
    genre: 'Fantasy',
    system: 'D&D 5e'
  })

  it('renders game information correctly', () => {
    render(<GameCard game={defaultGame} />)
    
    expect(screen.getByText('Dungeons & Dragons')).toBeInTheDocument()
    expect(screen.getByText('A fantasy tabletop role-playing game')).toBeInTheDocument()
    expect(screen.getByText('Fantasy')).toBeInTheDocument()
    expect(screen.getByText('D&D 5e')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn()
    render(<GameCard game={defaultGame} onClick={handleClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders default game icon when no logo is provided', () => {
    render(<GameCard game={defaultGame} />)
    
    // Vérifier que l'icône par défaut est présente
    const gamepadIcon = screen.getByTestId('gamepad-icon')
    expect(gamepadIcon).toBeInTheDocument()
  })

  it('renders game logo when provided', () => {
    const gameWithLogo = {
      ...defaultGame,
      images: { logo: '/path/to/logo.png' }
    }
    
    render(<GameCard game={gameWithLogo} />)
    
    const logo = screen.getByAltText('Logo Dungeons & Dragons')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/path/to/logo.png')
  })

  it('applies hover styles and transitions', () => {
    render(<GameCard game={defaultGame} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveClass(
      'hover:shadow-lg',
      'transition-all',
      'duration-200',
      'hover:scale-[1.02]',
      'cursor-pointer'
    )
  })

  it('displays genre and system badges', () => {
    render(<GameCard game={defaultGame} />)
    
    const genreBadge = screen.getByText('Fantasy')
    const systemBadge = screen.getByText('D&D 5e')
    
    expect(genreBadge).toBeInTheDocument()
    expect(systemBadge).toBeInTheDocument()
  })
})
