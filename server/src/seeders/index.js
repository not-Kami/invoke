console.log('📦 Loading seeder modules...');

import mongoose from 'mongoose';
import env from '../config/dotenv.config.js';
import seedUsers from './userSeeder.js';
import seedGames from './gameSeeder.js';
import seedSessions from './sessionSeeder.js';
import seedCampaigns from './campaignSeeder.js';
import seedFeedback from './feedbackSeeder.js';
import testDuplicateHandling from './testSeeder.js';

console.log('✅ All modules loaded successfully');

const seedDatabase = async () => {
    try {
        // Connect to database
        console.log('🔌 Connecting to database...');
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to database for seeding');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }

        // Seed data in order (due to dependencies)
        console.log('🌱 Seeding users...');
        const users = await seedUsers();
        console.log('Users created:', users.length);

        console.log('🎮 Seeding games...');
        const games = await seedGames(users);
        console.log('Games created:', games.length);

        console.log('🎭 Seeding sessions...');
        const sessions = await seedSessions(users, games);
        console.log('Sessions created:', sessions.length);

        console.log('📚 Seeding campaigns...');
        const campaigns = await seedCampaigns(users, games, sessions);
        console.log('Campaigns created:', campaigns.length);

        console.log('💬 Seeding feedback...');
        const feedback = await seedFeedback(users, sessions);
        console.log('Feedback created:', feedback.length);

        console.log('✅ Database seeded successfully!');
        console.log(`📊 Created ${users.length} users, ${games.length} games, ${sessions.length} sessions, ${campaigns.length} campaigns`);

        // Test duplicate handling
        console.log('\n🧪 Testing duplicate handling...');
        await testDuplicateHandling();

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        console.error('Error stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

console.log('🚀 Starting database seeder...');
seedDatabase().catch(error => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
}); 