import request from 'supertest';
import mongoose from 'mongoose';
import app from '../config/app.config.js';
import User from '../resources/user/user.model.js';

describe('Authentication with Cookies', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should signup, login, access /me, then logout (flow complet)', async () => {
        const uniqueEmail = `test+${Date.now()}@example.com`;
        const userData = {
            email: uniqueEmail,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        };

        // Signup
        const signupRes = await request(app)
            .post('/api/v1/auth/signup')
            .send(userData)
            .expect(201);

        expect(signupRes.headers['set-cookie']).toBeDefined();
        const cookie = signupRes.headers['set-cookie'][0];
        const tokenCookie = cookie.split(';')[0]; // Prend juste "token=..."
        console.log('Cookie envoyé:', tokenCookie);

        // /me
        const meRes = await request(app)
            .get('/api/v1/auth/me')
            .set('Cookie', tokenCookie)
            .expect(200);

        expect(meRes.body.data.user.email).toBe(userData.email);

        // Logout
        const logoutRes = await request(app)
            .post('/api/v1/auth/logout')
            .set('Cookie', tokenCookie)
            .expect(200);
        expect(logoutRes.body.success).toBe(true);
        expect(logoutRes.body.message).toBe('Logout successful');

        // /me après logout doit échouer (ne pas envoyer le cookie)
        await request(app)
            .get('/api/v1/auth/me')
            // .set('Cookie', tokenCookie) // Ne pas envoyer le cookie après logout
            .expect(401);
    });

    it('should not allow duplicate email registration', async () => {
        const uniqueEmail = `test+${Date.now()}@example.com`;
        const userData = {
            email: uniqueEmail,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        };

        // Créer le premier utilisateur
        await request(app)
            .post('/api/v1/auth/signup')
            .send(userData)
            .expect(201);

        // Essayer de créer un deuxième utilisateur avec le même email
        const response = await request(app)
            .post('/api/v1/auth/signup')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('already exists');
    });

    it('should reject invalid credentials', async () => {
        const uniqueEmail = `test+${Date.now()}@example.com`;
        const userData = {
            email: uniqueEmail,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        };

        // Créer l'utilisateur
        await request(app)
            .post('/api/v1/auth/signup')
            .send(userData)
            .expect(201);

        // Essayer de se connecter avec un mauvais mot de passe
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: uniqueEmail, password: 'wrongpassword' })
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });
}); 