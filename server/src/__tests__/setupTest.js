// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb+srv://kamilabs:Euj3vyaJ19sotBUz@invoke-backend.jlmwk7d.mongodb.net/?retryWrites=true&w=majority&appName=invoke-backend';

console.log('JWT_SECRET in test setup:', process.env.JWT_SECRET);

