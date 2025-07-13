import User from '../resources/user/user.model.js';
import UserRole from '../resources/user/user.enum.js';

const seedUsers = async () => {
    const users = [
        {
            name: 'Admin User',
            email: 'admin@invoke.com',
            password: 'admin123', // In real app, this would be hashed
            role: UserRole.ADMIN,
            isDM: true,
            avatar: 'https://example.com/avatars/admin.jpg',
            bio: 'System administrator and experienced DM'
        },
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: UserRole.USER,
            isDM: true,
            avatar: 'https://example.com/avatars/john.jpg',
            bio: 'Experienced D&D player and DM. Love creating epic campaigns!'
        },
        {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            password: 'password123',
            role: UserRole.USER,
            isDM: false,
            avatar: 'https://example.com/avatars/jane.jpg',
            bio: 'New to D&D but loving every session!'
        },
        {
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            password: 'password123',
            role: UserRole.USER,
            isDM: true,
            avatar: 'https://example.com/avatars/mike.jpg',
            bio: 'Veteran player with 10+ years of experience. Specialize in homebrew campaigns.'
        },
        {
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            password: 'password123',
            role: UserRole.USER,
            isDM: false,
            avatar: 'https://example.com/avatars/sarah.jpg',
            bio: 'RPG enthusiast. Love character creation and roleplaying!'
        }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    return createdUsers;
};

export default seedUsers; 