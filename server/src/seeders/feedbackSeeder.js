import Feedback from '../resources/feedback/feedback.model.js';

const seedFeedback = async (users, sessions) => {
    const feedback = [
        {
            author: users[1]._id, // Jane Smith
            rating: 5,
            comment: 'Amazing session! The DM was fantastic and the story was engaging. Can\'t wait for the next one!',
            target: users[0]._id, // John Doe (DM)
            session: sessions[0]._id // The Lost Mines of Phandelver
        },
        {
            author: users[2]._id, // Mike Johnson
            rating: 4,
            comment: 'Great one-shot! The cyberpunk setting was well-executed and the combat was exciting.',
            target: users[1]._id, // John Doe (DM)
            session: sessions[1]._id // Cyberpunk Red One-Shot
        },
        {
            author: users[3]._id, // Sarah Wilson
            rating: 5,
            comment: 'Perfect for beginners! The DM explained everything clearly and made the learning process fun.',
            target: users[0]._id, // John Doe (DM)
            session: sessions[2]._id // Pathfinder 2e Beginner Session
        },
        {
            author: users[1]._id, // Jane Smith
            rating: 3,
            comment: 'The session was okay, but it felt a bit rushed. More time for roleplaying would have been better.',
            target: users[1]._id, // Mike Johnson (DM)
            session: sessions[3]._id // D&D 5e Epic Campaign Session
        },
        {
            author: users[2]._id, // Mike Johnson
            rating: 5,
            comment: 'Epic boss fight! The DM really knows how to create tension and excitement.',
            target: users[1]._id, // Mike Johnson (DM)
            session: sessions[3]._id // D&D 5e Epic Campaign Session
        }
    ];

    const createdFeedback = await Feedback.insertMany(feedback);
    console.log(`✅ Created ${createdFeedback.length} feedback entries`);
    
    return createdFeedback;
};

export default seedFeedback; 