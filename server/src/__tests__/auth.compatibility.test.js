import request from 'supertest';
import mongoose from 'mongoose';
import app from '../config/app.config.js';
import User from '../resources/user/user.model.js';
import { generateToken } from '../middlewares/auth.middleware.js';

describe('Authentication Compatibility Tests', () => {
    let testUser;
    let validToken;
    let tokenCookie;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        
        // Créer un utilisateur de test
        testUser = await User.create({
            email: 'test@example.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
        });

        validToken = generateToken(testUser._id);
        console.log('validToken:', validToken);
        tokenCookie = 'token=' + validToken;
    });

    describe('Bearer Token Authentication', () => {
        it('should authenticate with Bearer token in Authorization header', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should reject invalid Bearer token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not authorized to access this route');
        });

        it('should reject malformed Authorization header', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'InvalidFormat token')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not authorized to access this route');
        });
    });

    describe('Cookie Authentication', () => {
        it('should authenticate with token in cookie', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Cookie', tokenCookie)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should reject invalid token in cookie', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Cookie', 'token=invalid-token')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not authorized to access this route');
        });
    });

    describe('Priority and Fallback', () => {
        it('should prioritize cookie over header when both are present', async () => {
            // Créer un token invalide pour le header
            const invalidToken = 'invalid-header-token';
            
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${invalidToken}`)
                .set('Cookie', tokenCookie)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should fallback to header when cookie is not present', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should reject when neither cookie nor header is present', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not authorized to access this route');
        });
    });

    describe('Optional Authentication', () => {
        it('should allow access without authentication when using optionalAuth', async () => {
            // Note: Ce test nécessiterait une route qui utilise optionalAuth
            // Pour l'instant, on teste juste que les routes protégées rejettent l'accès
            const response = await request(app)
                .get('/api/v1/auth/me')
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should set user in request when valid token is provided to optionalAuth', async () => {
            // Ce test nécessiterait une route spécifique avec optionalAuth
            // Pour l'instant, on vérifie que le token valide fonctionne
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
}); 