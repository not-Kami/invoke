import mongoose from 'mongoose';
import Game from '../src/resources/game/game.model.js';

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/invoke';

async function migrateGames() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les jeux qui n'ont pas le champ featured
    const gamesWithoutFeatured = await Game.find({ featured: { $exists: false } });
    console.log(`📊 ${gamesWithoutFeatured.length} jeux sans le champ 'featured' trouvés`);

    if (gamesWithoutFeatured.length > 0) {
      // Mettre à jour tous ces jeux pour ajouter featured: false
      const result = await Game.updateMany(
        { featured: { $exists: false } },
        { $set: { featured: false } }
      );
      
      console.log(`✅ ${result.modifiedCount} jeux mis à jour avec featured: false`);
      
      // Afficher les jeux mis à jour
      const updatedGames = await Game.find({});
      console.log('\n📋 Liste des jeux après migration:');
      updatedGames.forEach(game => {
        console.log(`- ${game.name}: featured = ${game.featured}`);
      });
    } else {
      console.log('✅ Tous les jeux ont déjà le champ featured');
    }

    console.log('\n🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter la migration
migrateGames();
