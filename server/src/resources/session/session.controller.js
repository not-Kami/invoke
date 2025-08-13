import Session from "./session.model.js";

// Fonction utilitaire pour mettre à jour automatiquement les statuts des sessions
async function updateSessionStatuses() {
    try {
        const now = new Date();
        
        // Mettre à jour les sessions passées en "finished"
        const finishedSessions = await Session.updateMany(
            { 
                status: { $in: ['open', 'full'] },
                date: { $lt: now }
            },
            { 
                status: 'finished',
                updatedAt: now
            }
        );
        
        if (finishedSessions.modifiedCount > 0) {
            console.log(`Updated ${finishedSessions.modifiedCount} sessions to finished status`);
        }
        
        // Mettre à jour les sessions pleines qui ont des places libres
        const fullSessions = await Session.find({ 
            status: 'full',
            $expr: { $lt: [{ $size: '$players' }, '$maxPlayers'] }
        });
        
        for (const session of fullSessions) {
            session.status = 'open';
            session.updatedAt = now;
            await session.save();
        }
        
        if (fullSessions.length > 0) {
            console.log(`Updated ${fullSessions.length} sessions from full to open status`);
        }
        
    } catch (error) {
        console.error('Error updating session statuses:', error);
    }
}

const sessionController = {
    createSession: async (req, res) => {
        try {
            console.log('Creating session with data:', req.body);
            console.log('maxPlayers from request:', req.body.maxPlayers);
            
            // Validation des données requises
            const { title, description, date, game, dm } = req.body;
            if (!title || !description || !date || !game || !dm) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: title, description, date, game, dm'
                });
            }

            // Créer la session
            const session = await Session.create(req.body);
            
            console.log('Session created successfully:', session._id);
            console.log('Session data after creation:', {
                title: session.title,
                maxPlayers: session.maxPlayers,
                players: session.players.length
            });
            
            res.status(201).json({
                success: true,
                message: 'Session created successfully',
                data: session
            });
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create session',
                error: error.message
            });
        }
    },
    getSessions: async (req, res) => {
        try {
            const { q, system, dateStart, dateEnd, format, slots_gte, page = 1, limit = 10, sort } = req.query;
            
            // Mettre à jour automatiquement les statuts des sessions
            await updateSessionStatuses();
            
            const filter = {};
            if (q) {
                filter.$or = [
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ];
            }
            if (system) filter.system = system;
            if (format) filter.format = format;
            if (dateStart || dateEnd) {
                filter.date = {};
                if (dateStart) filter.date.$gte = new Date(dateStart);
                if (dateEnd) filter.date.$lte = new Date(dateEnd);
            }
            if (slots_gte) filter.slots = { $gte: parseInt(slots_gte) };

            // Par défaut, ne pas afficher les sessions terminées
            if (!req.query.showFinished) {
                filter.status = { $nin: ['finished', 'cancelled'] };
            }
            
            // Tri par défaut : sessions ouvertes d'abord, puis pleines
            const sortOption = sort ? (sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 }) : { 
                status: 1, // open (1), full (2)
                date: 1    // puis par date croissante
            };
            
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const sessions = await Session.find(filter)
                .populate('dm', 'firstName lastName avatar')
                .populate('game', 'name system genre')
                .populate('players', 'firstName lastName avatar')
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit));
            const total = await Session.countDocuments(filter);
            res.status(200).json({
                success: true,
                data: sessions,
                page: parseInt(page),
                limit: parseInt(limit),
                total
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch sessions', error: error.message });
        }
    },
    getSession: async (req, res) => {
        try {
            const session = await Session.findById(req.params.id)
                .populate('dm', 'firstName lastName avatar')
                .populate('game', 'name system genre')
                .populate('players', 'firstName lastName avatar');
                
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            res.status(200).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    updateSession: async (req, res) => {
        try {
            const sessionId = req.params.id;
            const userId = req.user._id;

            console.log(`Updating session ${sessionId} by user ${userId}`);

            // Vérifier que la session existe
            const existingSession = await Session.findById(sessionId);
            if (!existingSession) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            // Vérifier que l'utilisateur est le DM de la session
            if (existingSession.dm.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the Dungeon Master can update their own session'
                });
            }

            // Mettre à jour la session
            const session = await Session.findByIdAndUpdate(sessionId, req.body, { new: true });
            
            console.log(`Session ${sessionId} updated successfully by user ${userId}`);
            
            res.status(200).json({
                success: true,
                message: 'Session updated successfully',
                data: session
            });
        } catch (error) {
            console.error('Error updating session:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update session',
                error: error.message
            });
        }
    },
    deleteSession: async (req, res) => {
        try {
            const session = await Session.findByIdAndDelete(req.params.id);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            res.status(200).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    getFeaturedSessions: async (req, res) => {
        try {
            const sessions = await Session.find({ featured: true, status: 'open' })
                .populate('game', 'name system')
                .populate('dm', 'firstName lastName avatar')
                .sort({ createdAt: -1 })
                .limit(6);
            
            res.status(200).json({
                success: true,
                data: sessions
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch featured sessions', error: error.message });
        }
    },

    // Fonction admin pour mettre à jour le statut featured
    adminUpdateSession: async (req, res) => {
        try {
            const sessionId = req.params.id;
            const { featured } = req.body;

            console.log(`Admin updating session ${sessionId} featured status to ${featured}`);

            // Vérifier que la session existe
            const existingSession = await Session.findById(sessionId);
            if (!existingSession) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            // Mettre à jour uniquement le champ featured
            const session = await Session.findByIdAndUpdate(
                sessionId, 
                { featured }, 
                { new: true }
            );
            
            console.log(`Session ${sessionId} featured status updated to ${featured}`);
            
            res.status(200).json({
                success: true,
                message: 'Session featured status updated successfully',
                data: session
            });
        } catch (error) {
            console.error('Error updating session featured status:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update session featured status',
                error: error.message
            });
        }
    },

    // Inviter un joueur à une session
    invitePlayer: async (req, res) => {
        try {
            const { sessionId } = req.params;
            const { playerId } = req.body;

            console.log(`Inviting player ${playerId} to session ${sessionId}`);

            // Vérifier que la session existe
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            // Vérifier que l'utilisateur est le DM de la session
            if (session.dm.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the Dungeon Master can invite players'
                });
            }

            // Vérifier que le joueur n'est pas déjà dans la session
            if (session.players.includes(playerId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Player is already in this session'
                });
            }

            // Vérifier qu'il y a de la place
            if (session.players.length >= session.maxPlayers) {
                return res.status(400).json({
                    success: false,
                    message: 'Session is full'
                });
            }

            // Ajouter le joueur à la session
            session.players.push(playerId);
            
            // Mettre à jour le statut si nécessaire
            if (session.players.length >= session.maxPlayers) {
                session.status = 'full';
            }

            await session.save();

            console.log(`Player ${playerId} successfully invited to session ${sessionId}`);

            res.status(200).json({
                success: true,
                message: 'Player invited successfully',
                data: session
            });
        } catch (error) {
            console.error('Error inviting player:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to invite player',
                error: error.message
            });
        }
    },

    // Retirer un joueur d'une session
    removePlayer: async (req, res) => {
        try {
            const sessionId = req.params.sessionId;
            const { playerId } = req.body;

            console.log(`Removing player ${playerId} from session ${sessionId}`);

            // Vérifier que la session existe
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            // Vérifier que l'utilisateur est le DM de la session
            if (session.dm.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the Dungeon Master can remove players'
                });
            }

            // Retirer le joueur de la session
            session.players = session.players.filter(id => id.toString() !== playerId);
            
            // Mettre à jour le statut si nécessaire
            if (session.status === 'full' && session.players.length < session.maxPlayers) {
                session.status = 'open';
            }

            await session.save();

            console.log(`Player ${playerId} successfully removed from session ${sessionId}`);

            res.status(200).json({
                success: true,
                message: 'Player removed successfully',
                data: session
            });
        } catch (error) {
            console.error('Error removing player:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove player',
                error: error.message
            });
        }
    },

    // Rejoindre une session en tant que joueur
    joinSession: async (req, res) => {
        try {
            const sessionId = req.params.id;
            const userId = req.user._id;

            console.log(`User ${userId} attempting to join session ${sessionId}`);

            // Vérifier que la session existe
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            // Vérifier que l'utilisateur n'est pas le DM
            if (session.dm.toString() === userId.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dungeon Master cannot join their own session as a player'
                });
            }

            // Vérifier que la session est ouverte
            if (session.status !== 'open') {
                return res.status(400).json({
                    success: false,
                    message: 'Session is not open for joining'
                });
            }

            // Vérifier que le joueur n'est pas déjà dans la session
            if (session.players.includes(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already in this session'
                });
            }

            // Vérifier qu'il y a de la place
            if (session.players.length >= session.maxPlayers) {
                return res.status(400).json({
                    success: false,
                    message: 'Session is full'
                });
            }

            // Ajouter le joueur à la session
            session.players.push(userId);
            
            // Mettre à jour le statut si nécessaire
            if (session.players.length >= session.maxPlayers) {
                session.status = 'full';
            }

            await session.save();

            console.log(`User ${userId} successfully joined session ${sessionId}`);

            res.status(200).json({
                success: true,
                message: 'Successfully joined session',
                data: session
            });
        } catch (error) {
            console.error('Error joining session:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to join session',
                error: error.message
            });
        }
    }
}

export default sessionController;