import User from '../resources/user/user.model.js';
import Game from '../resources/game/game.model.js';
import UserRole from '../resources/user/user.enum.js';

const testDuplicateHandling = async () => {
    console.log('🧪 Testing duplicate handling...');
    
    try {
        // Test 1: Try to create a user with existing email
        console.log('📧 Testing duplicate email...');
        const duplicateUser = {
            name: 'Duplicate User',
            email: 'admin@invoke.com', // This email already exists
            password: 'password123',
            role: UserRole.USER,
            isDM: false
        };
        
        try {
            const newUser = await User.create(duplicateUser);
            console.log('❌ Duplicate email was created (should have failed):', newUser.name);
        } catch (error) {
            console.log('✅ Duplicate email correctly rejected:', error.message);
        }
        
        // Test 2: Try to create a game with existing name
        console.log('🎮 Testing duplicate game name...');
        const duplicateGame = {
            name: 'Dungeons & Dragons 5e', // This name already exists
            description: 'Duplicate game description',
            genre: 'Fantasy',
            system: 'D&D 5e',
            image: 'https://example.com/duplicate.jpg'
        };
        
        try {
            const newGame = await Game.create(duplicateGame);
            console.log('❌ Duplicate game name was created (should have failed):', newGame.name);
        } catch (error) {
            console.log('✅ Duplicate game name correctly rejected:', error.message);
        }
        
        // Test 3: Try to create valid new data
        console.log('✅ Testing valid new data...');
        const validUser = {
            name: 'New Test User',
            email: 'newuser@test.com',
            password: 'password123',
            role: UserRole.USER,
            isDM: false
        };
        
        const validGame = {
            name: 'New Test Game',
            description: 'A new test game',
            genre: 'Test',
            system: 'Test System',
            image: 'https://example.com/test.jpg'
        };
        
        const newUser = await User.create(validUser);
        console.log('✅ Valid user created:', newUser.name);
        
        const newGame = await Game.create(validGame);
        console.log('✅ Valid game created:', newGame.name);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

export default testDuplicateHandling; 