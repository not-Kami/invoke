import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

async function testNewApproach() {
  try {
    console.log('🧪 Test de la nouvelle approche d\'upload immédiat...');
    
    const gameId = '689dacaac99b92d359649615';
    
    // Créer des images de test
    const logoData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const portraitData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    fs.writeFileSync('test-logo.png', Buffer.from(logoData, 'base64'));
    fs.writeFileSync('test-portrait.png', Buffer.from(portraitData, 'base64'));
    
    // Test 1: Upload logo immédiat
    console.log('\n📤 Test 1: Upload logo immédiat');
    const logoFormData = new FormData();
    logoFormData.append('image', fs.createReadStream('test-logo.png'));
    
    const logoResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/game/${gameId}/logo`, {
      method: 'POST',
      body: logoFormData,
    });
    
    if (logoResponse.ok) {
      const logoResult = await logoResponse.json();
      console.log('✅ Logo uploadé et sauvé:', logoResult.data?.secure_url);
      console.log('🎮 Jeu mis à jour:', !!logoResult.data?.game);
    } else {
      console.log('❌ Erreur logo:', await logoResponse.text());
      return;
    }
    
    // Test 2: Upload portrait immédiat (après logo)
    console.log('\n📤 Test 2: Upload portrait immédiat (après logo)');
    const portraitFormData = new FormData();
    portraitFormData.append('image', fs.createReadStream('test-portrait.png'));
    
    const portraitResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/game/${gameId}/portrait`, {
      method: 'POST',
      body: portraitFormData,
    });
    
    if (portraitResponse.ok) {
      const portraitResult = await portraitResponse.json();
      console.log('✅ Portrait uploadé et sauvé:', portraitResult.data?.secure_url);
      console.log('🎮 Jeu mis à jour:', !!portraitResult.data?.game);
    } else {
      console.log('❌ Erreur portrait:', await portraitResponse.text());
      return;
    }
    
    // Test 3: Vérifier que le logo existe toujours
    console.log('\n🔍 Test 3: Vérification que le logo existe toujours');
    const gameResponse = await fetch(`http://localhost:3000/api/v1/games/${gameId}`);
    
    if (gameResponse.ok) {
      const gameResult = await gameResponse.json();
      console.log('🎮 Jeu récupéré:', {
        logo: gameResult.data?.images?.logo ? '✅ Présent' : '❌ Manquant',
        portrait: gameResult.data?.images?.portrait ? '✅ Présent' : '❌ Manquant',
        banner: gameResult.data?.images?.banner ? '✅ Présent' : '❌ Manquant'
      });
    } else {
      console.log('❌ Impossible de récupérer le jeu');
    }
    
    // Nettoyer
    fs.unlinkSync('test-logo.png');
    fs.unlinkSync('test-portrait.png');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testNewApproach();
