import Conversation from "../resources/conversation/conversation.model.js";

const conversationSeeder = async () => {
    try {
        console.log('🌱 Seeding conversations...');
        
        // Supprimer les conversations existantes
        await Conversation.deleteMany({});
        console.log('✅ Conversations existantes supprimées');
        
        // Créer des conversations de test
        const conversations = [
            {
                conversationType: "contact_admin",
                userEmail: "test@example.com",
                subject: "Problème avec ma session",
                priority: "medium",
                status: "open",
                messages: [
                    {
                        content: "Bonjour, j'ai un problème pour rejoindre ma session de ce soir. Pouvez-vous m'aider ?",
                        sender: null,
                        senderType: "user",
                        timestamp: new Date(Date.now() - 3600000), // 1h ago
                        isRead: false
                    }
                ],
                metadata: {
                    userAgent: "Mozilla/5.0 (Test Browser)",
                    ipAddress: "127.0.0.1",
                    referrer: "https://invoke.com/sessions"
                }
            },
            {
                conversationType: "contact_admin",
                userEmail: "user@example.com",
                subject: "Question sur les jeux",
                priority: "low",
                status: "in_progress",
                messages: [
                    {
                        content: "Quels sont les jeux les plus populaires sur la plateforme ?",
                        sender: null,
                        senderType: "user",
                        timestamp: new Date(Date.now() - 7200000), // 2h ago
                        isRead: true
                    },
                    {
                        content: "Bonjour ! Les jeux les plus populaires sont D&D 5e, Pathfinder et Call of Cthulhu. Avez-vous une préférence particulière ?",
                        sender: null, // Sera un ObjectId d'admin
                        senderType: "admin",
                        timestamp: new Date(Date.now() - 3600000), // 1h ago
                        isRead: true
                    }
                ],
                metadata: {
                    userAgent: "Mozilla/5.0 (Test Browser)",
                    ipAddress: "127.0.0.1",
                    referrer: "https://invoke.com/games"
                }
            },
            {
                conversationType: "contact_admin",
                userEmail: "urgent@example.com",
                subject: "Bug critique - Impossible de créer une session",
                priority: "urgent",
                status: "open",
                messages: [
                    {
                        content: "URGENT : Je ne peux pas créer de session, le bouton ne fonctionne pas ! J'ai une table qui attend !",
                        sender: null,
                        senderType: "user",
                        timestamp: new Date(Date.now() - 1800000), // 30min ago
                        isRead: false
                    }
                ],
                metadata: {
                    userAgent: "Mozilla/5.0 (Test Browser)",
                    ipAddress: "127.0.0.1",
                    referrer: "https://invoke.com/sessions/create"
                }
            }
        ];
        
        const createdConversations = await Conversation.insertMany(conversations);
        console.log(`✅ ${createdConversations.length} conversations créées`);
        
        // Afficher les IDs créés pour les tests
        createdConversations.forEach((conv, index) => {
            console.log(`   ${index + 1}. ${conv.subject} (ID: ${conv._id})`);
        });
        
        return createdConversations;
        
    } catch (error) {
        console.error('❌ Erreur lors du seeding des conversations:', error);
        throw error;
    }
};

export default conversationSeeder;
