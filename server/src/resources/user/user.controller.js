import User from "./user.model.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

// ===== CRÉATION ET RÉCUPÉRATION =====
export const createUser = catchAsync(async (req, res) => {
    const user = await User.create(req.body);
    
    res.status(201).json({
        success: true,
        data: user
    });
});

export const getUsers = catchAsync(async (req, res) => {
    const users = await User.find().select('-password');
    
    res.json({
        success: true,
        data: users
    });
});

export const getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut accéder à ce profil
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only view your own profile', 403));
    }
    
    const user = await User.findById(id).select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        success: true,
        data: user
    });
});

// ===== PROFIL UTILISATEUR =====
export const updateProfile = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut modifier ce profil
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own profile', 403));
    }
    
    // Champs autorisés pour le profil de base
    const allowedFields = ['firstName', 'lastName', 'nickname', 'bio', 'avatar'];
    const updateData = {};
    
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            updateData[key] = req.body[key];
        }
    });
    
    const user = await User.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
    }).select('-password');
    
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        success: true,
        data: user
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut supprimer ce profil
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only delete your own profile', 403));
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        success: true,
        message: 'User deleted successfully'
    });
});

export const uploadAvatar = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut modifier ce profil
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own profile', 403));
    }
    
    if (!req.file) {
        return next(new AppError('No image file provided', 400));
    }
    
    const avatarUrl = req.file.filename; // ou l'URL complète selon votre logique
    
    const user = await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { 
        new: true 
    }).select('-password');
    
    res.json({
        success: true,
        data: user
    });
});

// ===== RÔLE UTILISATEUR =====
export const updateRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { role, isDM } = req.body;
    
    // Vérifier que l'utilisateur peut modifier ce rôle
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own role', 403));
    }
    
    const updateData = {};
    
    // Gérer le rôle si fourni
    if (role !== undefined) {
        // Rôles autorisés
        const allowedRoles = ['user', 'admin'];
        if (!allowedRoles.includes(role)) {
            return next(new AppError('Invalid role. Must be "user" or "admin"', 400));
        }
        updateData.role = role;
    }
    
    // Gérer le statut DM si fourni
    if (isDM !== undefined) {
        // Vérifier que isDM est un booléen
        if (typeof isDM !== 'boolean') {
            return next(new AppError('isDM must be a boolean value', 400));
        }
        updateData.isDM = isDM;
    }
    
    // Vérifier qu'au moins un champ est fourni
    if (Object.keys(updateData).length === 0) {
        return next(new AppError('At least one field (role or isDM) must be provided', 400));
    }
    
    const user = await User.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
    }).select('-password');
    
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        success: true,
        data: user,
        message: 'User updated successfully'
    });
});

// ===== JEUX FAVORIS =====
export const getFavorites = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut voir ses propres favoris
    if (req.user._id.toString() !== id) {
        return next(new AppError('You can only view your own favorites', 403));
    }
    
    const user = await User.findById(id).populate('favorite_games');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        success: true,
        data: user.favorite_games || []
    });
});

export const addFavorite = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { gameId } = req.body;
    
    // Vérifier que l'utilisateur peut modifier ses propres favoris
    if (req.user._id.toString() !== id) {
        return next(new AppError('You can only modify your own favorites', 403));
    }
    
    if (!gameId) {
        return next(new AppError('Game ID is required', 400));
    }
    
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Vérifier que le jeu n'est pas déjà en favori
    if (user.favorite_games.includes(gameId)) {
        return res.status(400).json({
            success: false,
            error: 'Game is already in favorites',
            message: 'This game is already in your favorites list'
        });
    }
    
    user.favorite_games.push(gameId);
    await user.save();
    
    // Retourner la liste mise à jour
    const updatedUser = await User.findById(id).populate('favorite_games');
    
    res.json({
        success: true,
        data: updatedUser.favorite_games,
        message: 'Game added to favorites'
    });
});

export const removeFavorite = catchAsync(async (req, res, next) => {
    const { id, gameId } = req.params;
    
    // Vérifier que l'utilisateur peut modifier ses propres favoris
    if (req.user._id.toString() !== id) {
        return next(new AppError('You can only modify your own favorites', 403));
    }
    
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Vérifier que le jeu est bien dans la liste des favoris
    if (!user.favorite_games.includes(gameId)) {
        return res.status(400).json({
            success: false,
            error: 'Game not found in favorites',
            message: 'This game is not in your favorites list'
        });
    }
    
    // Retirer le jeu des favoris
    user.favorite_games = user.favorite_games.filter(id => id.toString() !== gameId);
    await user.save();
    
    // Retourner la liste mise à jour
    const updatedUser = await User.findById(id).populate('favorite_games');
    
    res.json({
        success: true,
        data: updatedUser.favorite_games,
        message: 'Game removed from favorites'
    });
});

// ===== JEUX MAÎTRISÉS (DM uniquement) =====
export const getMastered = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut voir ses propres jeux maîtrisés
    if (req.user._id.toString() !== id) {
        return next(new AppError('You can only view your own mastered games', 403));
    }
    
    const user = await User.findById(id).populate('mastered_games');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        success: true,
        data: user.mastered_games || []
    });
});

export const addMastered = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { gameId } = req.body;
    
    // Vérifier que l'utilisateur peut modifier ses propres jeux maîtrisés
    if (req.user._id.toString() !== id) {
        return next(new AppError('You can only modify your own mastered games', 403));
    }
    
    // Vérifier que l'utilisateur est un DM
    if (!req.user.isDM) {
        return next(new AppError('Only DMs can manage mastered games', 403));
    }
    
    if (!gameId) {
        return next(new AppError('Game ID is required', 400));
    }
    
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Vérifier que le jeu n'est pas déjà maîtrisé
    if (user.mastered_games.includes(gameId)) {
        return res.status(400).json({
            success: false,
            error: 'Game is already mastered',
            message: 'This game is already in your mastered games list'
        });
    }
    
    user.mastered_games.push(gameId);
    await user.save();
    
    // Retourner la liste mise à jour
    const updatedUser = await User.findById(id).populate('mastered_games');
    
    res.json({
        success: true,
        data: updatedUser.mastered_games,
        message: 'Game added to mastered games'
    });
});

export const removeMastered = catchAsync(async (req, res, next) => {
    const { id, gameId } = req.params;
    
    // Vérifier que l'utilisateur peut modifier ses propres jeux maîtrisés
    if (req.user._id.toString() !== id) {
        return next(new AppError('You can only modify your own mastered games', 403));
    }
    
    // Vérifier que l'utilisateur est un DM
    if (!req.user.isDM) {
        return next(new AppError('Only DMs can manage mastered games', 403));
    }
    
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Vérifier que le jeu est bien dans la liste des jeux maîtrisés
    if (!user.mastered_games.includes(gameId)) {
        return res.status(400).json({
            success: false,
            error: 'Game not found in mastered games',
            message: 'This game is not in your mastered games list'
        });
    }
    
    // Retirer le jeu des jeux maîtrisés
    user.mastered_games = user.mastered_games.filter(id => id.toString() !== gameId);
    await user.save();
    
    // Retourner la liste mise à jour
    const updatedUser = await User.findById(id).populate('mastered_games');
    
    res.json({
        success: true,
        data: updatedUser.mastered_games,
        message: 'Game removed from mastered games'
    });
});

// ===== FEATURED DMS =====
export const getFeaturedDMs = catchAsync(async (req, res) => {
    const featuredDMs = await User.find({ 
        role: 'dm',
        isFeatured: true 
    }).select('firstName lastName nickname bio avatar rating').limit(10);
    
    res.json({
        success: true,
        data: featuredDMs
    });
});

// ===== UPDATE USER (Admin uniquement) =====
export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Vérification admin
    if (req.user.role !== 'admin') {
        return next(new AppError('Only admins can update users', 403));
    }
    
    // Vérifier que l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Mise à jour avec validation
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
    });
    
    res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
    });
});

// ===== UPDATE USER FEATURED (Admin uniquement) =====
export const updateUserFeatured = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { featured } = req.body;
    
    // Vérification admin
    if (req.user.role !== 'admin') {
        return next(new AppError('Only admins can update user featured status', 403));
    }
    
    // Vérifier que l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Mise à jour du statut featured uniquement
    const updatedUser = await User.findByIdAndUpdate(id, { featured }, { 
        new: true, 
        runValidators: true 
    });
    
    res.json({
        success: true,
        data: updatedUser,
        message: 'User featured status updated successfully'
    });
});