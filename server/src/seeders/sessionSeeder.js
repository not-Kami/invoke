import Session from '../resources/session/session.model.js';

const seedSessions = async (users, games) => {
    console.log('🔍 Debug - Users received:', users.length);
    console.log('🔍 Debug - Games received:', games.length);
    console.log('🔍 Debug - Games:', games.map(g => ({ name: g.name, _id: g._id })));
    
    const dndGame = games.find(game => game.name === 'Dungeons & Dragons 5e');
    const pathfinderGame = games.find(game => game.name === 'Pathfinder 2e');
    const cyberpunkGame = games.find(game => game.name === 'Cyberpunk Red');
    
    console.log('🔍 Debug - DND Game:', dndGame);
    console.log('🔍 Debug - Pathfinder Game:', pathfinderGame);
    console.log('🔍 Debug - Cyberpunk Game:', cyberpunkGame);
    
    const dmUsers = users.filter(user => user.isDM);
    const playerUsers = users.filter(user => !user.isDM);
    
    console.log('🔍 Debug - DM Users:', dmUsers.length);
    console.log('🔍 Debug - Player Users:', playerUsers.length);
    console.log('🔍 Debug - DM Users details:', dmUsers.map(u => ({ name: u.name, _id: u._id })));
    console.log('🔍 Debug - Player Users details:', playerUsers.map(u => ({ name: u.name, _id: u._id })));
    
    const sessions = [
        {
            title: 'The Lost Mines of Phandelver',
            description: 'A D&D 5e adventure for levels 1-5. The party embarks on a journey to find the lost mines of Phandelver.',
            date: new Date('2024-02-15T18:00:00.000Z'),
            sessionType: 'online',
            isOneShot: false,
            game: dndGame._id,
            dm: dmUsers[0]._id,
            players: [playerUsers[0]._id, playerUsers[1]._id],
            status: 'open'
        },
        {
            title: 'Cyberpunk Red One-Shot',
            description: 'A one-shot adventure in Night City. The players are hired to steal corporate data.',
            date: new Date('2024-02-20T19:00:00.000Z'),
            sessionType: 'offline',
            isOneShot: true,
            game: cyberpunkGame._id,
            dm: dmUsers[1]._id,
            players: [playerUsers[0]._id, playerUsers[1]._id],
            status: 'full'
        },
        {
            title: 'Pathfinder 2e Beginner Session',
            description: 'Perfect for new players! Learn the basics of Pathfinder 2e with a simple adventure.',
            date: new Date('2024-02-25T17:00:00.000Z'),
            sessionType: 'online',
            isOneShot: true,
            game: pathfinderGame._id,
            dm: dmUsers[0]._id,
            players: [playerUsers[1]._id],
            status: 'open'
        },
        {
            title: 'D&D 5e Epic Campaign Session',
            description: 'Continuing our epic campaign. The party faces the final boss of the dungeon.',
            date: new Date('2024-03-01T20:00:00.000Z'),
            sessionType: 'online',
            isOneShot: false,
            game: dndGame._id,
            dm: dmUsers[1]._id,
            players: [playerUsers[0]._id, playerUsers[1]._id],
            status: 'open'
        }
    ];

    const createdSessions = await Session.insertMany(sessions);
    console.log(`✅ Created ${createdSessions.length} sessions`);
    
    return createdSessions;
};

export default seedSessions; 