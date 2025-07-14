import Campaign from '../resources/campaign/campaign.model.js';

const seedCampaigns = async (users, games, sessions) => {
    const dndGame = games.find(game => game.name === 'Dungeons & Dragons 5e');
    const pathfinderGame = games.find(game => game.name === 'Pathfinder 2e');
    
    const dmUsers = users.filter(user => user.isDM);
    const playerUsers = users.filter(user => !user.isDM);
    
    const dndSessions = sessions.filter(session => session.game.toString() === dndGame._id.toString());
    const pathfinderSessions = sessions.filter(session => session.game.toString() === pathfinderGame._id.toString());
    
    const campaigns = [
        {
            name: 'The Lost Mines of Phandelver',
            description: 'A D&D 5e campaign for levels 1-5. The party embarks on a journey to find the lost mines of Phandelver and uncover the secrets within.',
            startDate: new Date('2024-01-15T00:00:00.000Z'),
            endDate: new Date('2024-06-15T00:00:00.000Z'),
            game: dndGame._id,
            dm: dmUsers[0]._id,
            players: [playerUsers[0]._id, playerUsers[1]._id],
            sessions: dndSessions.map(session => session._id),
            active: true
        },
        {
            name: 'Pathfinder 2e Beginner Campaign',
            description: 'A beginner-friendly Pathfinder 2e campaign designed to teach new players the system.',
            startDate: new Date('2024-02-01T00:00:00.000Z'),
            endDate: new Date('2024-05-01T00:00:00.000Z'),
            game: pathfinderGame._id,
            dm: dmUsers[0]._id,
            players: [playerUsers[1]._id],
            sessions: pathfinderSessions.map(session => session._id),
            active: true
        },
        {
            name: 'Epic D&D 5e Campaign',
            description: 'An epic high-level campaign where the party faces world-threatening challenges.',
            startDate: new Date('2023-09-01T00:00:00.000Z'),
            endDate: new Date('2024-12-31T00:00:00.000Z'),
            game: dndGame._id,
            dm: dmUsers[1]._id,
            players: [playerUsers[0]._id, playerUsers[1]._id, playerUsers[2]._id],
            sessions: [],
            active: true
        }
    ];

    const createdCampaigns = await Campaign.insertMany(campaigns);
    console.log(`✅ Created ${createdCampaigns.length} campaigns`);
    
    return createdCampaigns;
};

export default seedCampaigns; 