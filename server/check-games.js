import mongoose from 'mongoose';
import Game from './src/resources/game/game.model.js';
import env from './src/config/dotenv.config.js';

async function checkGames() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    const games = await Game.find({}).select('name images').limit(5);
    console.log('🎮 Jeux en base:');
    games.forEach(game => {
      console.log(`- ${game.name}:`);
      console.log(`  Logo: ${game.images?.logo || 'Aucun'}`);
      console.log(`  Portrait: ${game.images?.portrait || 'Aucun'}`);
      console.log(`  Banner: ${game.images?.banner || 'Aucun'}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkGames();
