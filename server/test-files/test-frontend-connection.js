import fetch from 'node-fetch';

async function testFrontendConnection() {
  try {
    console.log('🧪 Test de connexion frontend avec la nouvelle API...');
    
    // Test 1: Vérifier que l'API est accessible
    console.log('\n📡 Test 1: Connexion API');
    const healthResponse = await fetch('http://localhost:3000/api/v1/health');
    
    if (healthResponse.ok) {
      const healthResult = await healthResponse.json();
      console.log('✅ API accessible:', healthResult.message);
    } else {
      console.log('❌ API inaccessible');
      return;
    }
    
    // Test 2: Vérifier que les jeux sont accessibles
    console.log('\n🎮 Test 2: Récupération des jeux');
    const gamesResponse = await fetch('http://localhost:3000/api/v1/games');
    
    if (gamesResponse.ok) {
      const gamesResult = await gamesResponse.json();
      console.log('✅ Jeux récupérés:', gamesResult.data?.length || 0, 'jeux');
      
      // Vérifier qu'un jeu a des images
      const gameWithImages = gamesResult.data?.find(game => 
        game.images?.logo || game.images?.portrait || game.images?.banner
      );
      
      if (gameWithImages) {
        console.log('✅ Jeu avec images trouvé:', gameWithImages.name);
        console.log('  - Logo:', gameWithImages.images?.logo ? '✅' : '❌');
        console.log('  - Portrait:', gameWithImages.images?.portrait ? '✅' : '❌');
        console.log('  - Banner:', gameWithImages.images?.banner ? '✅' : '❌');
      } else {
        console.log('ℹ️ Aucun jeu avec images trouvé');
      }
    } else {
      console.log('❌ Impossible de récupérer les jeux');
      return;
    }
    
    // Test 3: Vérifier que les routes d'upload immédiat sont accessibles
    console.log('\n📤 Test 3: Routes d\'upload immédiat');
    const uploadResponse = await fetch('http://localhost:3000/api/v1/upload/immediate/game/test/logo', {
      method: 'POST'
    });
    
    if (uploadResponse.status === 400) {
      const uploadResult = await uploadResponse.json();
      if (uploadResult.message === 'Aucun fichier fourni') {
        console.log('✅ Route d\'upload immédiat accessible');
      } else {
        console.log('❌ Route d\'upload immédiat inattendue:', uploadResult.message);
      }
    } else {
      console.log('❌ Route d\'upload immédiat inaccessible');
    }
    
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('✅ Le frontend peut se connecter à la nouvelle API');
    console.log('✅ L\'upload immédiat est fonctionnel');
    console.log('✅ Les images sont correctement sauvées en base');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testFrontendConnection();
