import { catchAsync } from "../../utils/catchAsync.js";
import User from "../user/user.model.js";
import Session from "../session/session.model.js";
import Game from "../game/game.model.js";
import Campaign from "../campaign/campaign.model.js";

export const globalSearch = catchAsync(async (req, res) => {
    const { q: query, type, limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
        return res.json({
            success: true,
            data: {
                users: [],
                sessions: [],
                games: [],
                campaigns: [],
                total: 0
            }
        });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    const searchLimit = Math.min(parseInt(limit), 50); // Max 50 résultats par type

    try {
        // Recherche parallèle dans toutes les ressources
        const [users, sessions, games, campaigns] = await Promise.all([
            // Recherche dans les utilisateurs
            User.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { email: searchRegex },
                    { nickname: searchRegex }
                ],
                deletedAt: null // Exclure les utilisateurs supprimés
            })
            .select('firstName lastName email nickname role isDM featured avatar createdAt')
            .limit(searchLimit),

            // Recherche dans les sessions
            Session.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            })
            .populate('dm', 'firstName lastName email nickname')
            .populate('game', 'name images')
            .populate('players', 'firstName lastName email nickname')
            .limit(searchLimit),

            // Recherche dans les jeux
            Game.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex },
                    { publisher: searchRegex }
                ]
            })
            .select('name description publisher images featured createdAt')
            .limit(searchLimit),

            // Recherche dans les campagnes
            Campaign.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            })
            .populate('dm', 'firstName lastName email nickname')
            .populate('game', 'name images')
            .populate('players', 'firstName lastName email nickname')
            .limit(searchLimit)
        ]);

        // Si un type spécifique est demandé, ne retourner que ce type
        if (type) {
            const results = {
                users: type === 'users' ? users : [],
                sessions: type === 'sessions' ? sessions : [],
                games: type === 'games' ? games : [],
                campaigns: type === 'campaigns' ? campaigns : []
            };
            
            const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
            
            return res.json({
                success: true,
                data: {
                    ...results,
                    total,
                    query: query.trim(),
                    type: type || 'all'
                }
            });
        }

        // Retourner tous les résultats
        const total = users.length + sessions.length + games.length + campaigns.length;

        res.json({
            success: true,
            data: {
                users,
                sessions,
                games,
                campaigns,
                total,
                query: query.trim(),
                type: 'all'
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
});

export const searchSuggestions = catchAsync(async (req, res) => {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
        return res.json({
            success: true,
            data: []
        });
    }

    const searchRegex = new RegExp(query.trim(), 'i');

    try {
        // Suggestions rapides (limitées à 5 par type)
        const [userSuggestions, sessionSuggestions, gameSuggestions] = await Promise.all([
            User.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { email: searchRegex },
                    { nickname: searchRegex }
                ],
                deletedAt: null
            })
            .select('firstName lastName email nickname')
            .limit(5),

            Session.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            })
            .select('title description')
            .limit(5),

            Game.find({
                $or: [
                    { name: searchRegex },
                    { publisher: searchRegex }
                ]
            })
            .select('name publisher')
            .limit(5)
        ]);

        const suggestions = [
            ...userSuggestions.map(user => ({
                type: 'user',
                id: user._id,
                title: `${user.firstName} ${user.lastName}`,
                subtitle: user.email,
                icon: 'user'
            })),
            ...sessionSuggestions.map(session => ({
                type: 'session',
                id: session._id,
                title: session.title,
                subtitle: session.description?.substring(0, 100) + '...',
                icon: 'calendar'
            })),
            ...gameSuggestions.map(game => ({
                type: 'game',
                id: game._id,
                title: game.name,
                subtitle: game.publisher,
                icon: 'gamepad'
            }))
        ];

        res.json({
            success: true,
            data: suggestions.slice(0, 10) // Max 10 suggestions
        });

    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Search suggestions failed',
            error: error.message
        });
    }
});
