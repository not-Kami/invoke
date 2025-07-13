import User from '../user/user.model.js';
import { generateToken, hashPassword, comparePassword } from '../../middlewares/auth.middleware.js';
import logger from '../../config/logger.config.js';

// @desc    Register user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role = 'user' } = req.body;

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
            role
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
            createdAt: user.createdAt
        };

        logger.info(`New user registered: ${user.email}`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
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
            createdAt: user.createdAt
        };

        logger.info(`User logged in: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
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
        const user = await User.findById(req.user._id);
        
        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    createdAt: user.createdAt
                }
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