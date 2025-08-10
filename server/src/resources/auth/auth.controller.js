import User from '../user/user.model.js';
import { generateToken, hashPassword, comparePassword } from '../../middlewares/auth.middleware.js';
import logger from '../../config/logger.config.js';

// @desc    Register user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role = 'user', isDM = false, avatar } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await hashPassword(password);

        // Créer l'utilisateur
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            isDM,
            avatar: avatar || null
        });

        // Générer le token
        const token = generateToken(user._id);

        // Retourner la réponse sans le mot de passe
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isDM: user.isDM,
            featured: user.featured,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        logger.info(`New user registered: ${user.email}`);

        // Définir le cookie HTTP-only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS en production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        logger.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Générer le token
        const token = generateToken(user._id);

        // Retourner la réponse sans le mot de passe
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isDM: user.isDM,
            featured: user.featured,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        logger.info(`User logged in: ${user.email}`);

        console.log('Login Debug - Token generated:', token ? 'Present' : 'Missing');
        console.log('Login Debug - User response:', userResponse);
        console.log('Login Debug - User role:', userResponse.role);
        
        // Définir le cookie HTTP-only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS en production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        console.log('GetMe Debug - req.user:', req.user);
        console.log('GetMe Debug - req.user._id:', req.user._id);
        
        const user = await User.findById(req.user._id);
        console.log('GetMe Debug - Found user:', user);
        
        if (!user) {
            console.log('GetMe Debug - User not found');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isDM: user.isDM,
            featured: user.featured,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        console.log('GetMe Debug - User response:', userResponse);
        
        res.status(200).json({
            success: true,
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        logger.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user info',
            error: error.message
        });
    }
};

// @desc    Update user password
// @route   PUT /api/v1/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Récupérer l'utilisateur avec le mot de passe
        const user = await User.findById(req.user._id).select('+password');

        // Vérifier l'ancien mot de passe
        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hasher le nouveau mot de passe
        const hashedNewPassword = await hashPassword(newPassword);

        // Mettre à jour le mot de passe
        user.password = hashedNewPassword;
        await user.save();

        logger.info(`Password updated for user: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        logger.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Supprimer le cookie
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0)
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout',
            error: error.message
        });
    }
}; 