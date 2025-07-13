import Game from '../resources/game/game.model.js';

const seedGames = async (users) => {
    const games = [
        {
            name: 'Dungeons & Dragons 5e',
            description: 'The world\'s greatest roleplaying game. Create heroic characters, embark on epic adventures, and battle monsters in a world of fantasy.',
            genre: 'Fantasy',
            system: 'D&D 5e',
            image: 'https://example.com/images/dnd5e.jpg'
        },
        {
            name: 'Pathfinder 2e',
            description: 'A fantasy tabletop roleplaying game that puts you in the role of a brave adventurer fighting to survive in a world beset by magic and evil.',
            genre: 'Fantasy',
            system: 'Pathfinder 2e',
            image: 'https://example.com/images/pathfinder2e.jpg'
        },
        {
            name: 'Call of Cthulhu',
            description: 'A horror roleplaying game based on the works of H.P. Lovecraft. Investigate mysteries and face cosmic horrors.',
            genre: 'Horror',
            system: 'Call of Cthulhu',
            image: 'https://example.com/images/callofcthulhu.jpg'
        },
        {
            name: 'Cyberpunk Red',
            description: 'A roleplaying game set in a dystopian future where technology and corporate power rule the world.',
            genre: 'Sci-Fi',
            system: 'Cyberpunk Red',
            image: 'https://example.com/images/cyberpunkred.jpg'
        },
        {
            name: 'Vampire: The Masquerade',
            description: 'A gothic-punk roleplaying game where you play as vampires struggling with their humanity in a world of darkness.',
            genre: 'Horror',
            system: 'Vampire: The Masquerade',
            image: 'https://example.com/images/vampire.jpg'
        }
    ];

    const createdGames = await Game.insertMany(games);
    console.log(`✅ Created ${createdGames.length} games`);
    
    return createdGames;
};

export default seedGames; 