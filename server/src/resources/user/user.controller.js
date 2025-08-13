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
    const { role } = req.body;
    
    // Vérifier que l'utilisateur peut modifier ce rôle
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own role', 403));
    }
    
    // Rôles autorisés
    const allowedRoles = ['user', 'dm'];
    if (!allowedRoles.includes(role)) {
        return next(new AppError('Invalid role. Must be "user" or "dm"', 400));
    }
    
    const user = await User.findByIdAndUpdate(id, { role }, { 
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

// ===== JEUX FAVORIS =====
export const getFavorites = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur peut voir ces favoris
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
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
    
    // Vérifier que l'utilisateur peut modifier ses favoris
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
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
        return next(new AppError('Game is already in favorites', 400));
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
    
    // Vérifier que l'utilisateur peut modifier ses favoris
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own favorites', 403));
    }
    
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
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
    
    // Vérifier que l'utilisateur peut voir ces jeux maîtrisés
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
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
    
    // Vérifier que l'utilisateur peut modifier ses jeux maîtrisés
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own mastered games', 403));
    }
    
    // Vérifier que l'utilisateur est un DM
    if (req.user.role !== 'dm' && req.user.role !== 'admin') {
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
        return next(new AppError('Game is already mastered', 400));
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
    
    // Vérifier que l'utilisateur peut modifier ses jeux maîtrisés
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return next(new AppError('You can only modify your own mastered games', 403));
    }
    
    // Vérifier que l'utilisateur est un DM
    if (req.user.role !== 'dm' && req.user.role !== 'admin') {
        return next(new AppError('Only DMs can manage mastered games', 403));
    }
    
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
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