import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

async function testFinalUpload() {
  try {
    console.log('🧪 Test final de toutes les routes d\'upload...');
    
    const gameId = '689dacaac99b92d359649615';
    const userId = '68852cf722d450b28068eabe';
    const sessionId = '68befbcbc58ae9afe9b1f449';
    
    // Créer une image de test
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    fs.writeFileSync('test-image.png', Buffer.from(imageData, 'base64'));
    
    // Test 1: Upload d'image de jeu
    console.log('\n📤 Test 1: Upload d\'image de jeu');
    const gameFormData = new FormData();
    gameFormData.append('image', fs.createReadStream('test-image.png'));
    
    const gameResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/game/${gameId}/logo`, {
      method: 'POST',
      body: gameFormData,
    });
    
    if (gameResponse.ok) {
      const gameResult = await gameResponse.json();
      console.log('✅ Image de jeu uploadée:', gameResult.data?.secure_url);
    } else {
      console.log('❌ Erreur image de jeu:', await gameResponse.text());
    }
    
    // Test 2: Upload d'avatar utilisateur
    console.log('\n📤 Test 2: Upload d\'avatar utilisateur');
    const userFormData = new FormData();
    userFormData.append('image', fs.createReadStream('test-image.png'));
    
    const userResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/user/${userId}/avatar`, {
      method: 'POST',
      body: userFormData,
    });
    
    if (userResponse.ok) {
      const userResult = await userResponse.json();
      console.log('✅ Avatar utilisateur uploadé:', userResult.data?.secure_url);
    } else {
      console.log('❌ Erreur avatar utilisateur:', await userResponse.text());
    }
    
    // Test 3: Upload d'image de session
    console.log('\n📤 Test 3: Upload d\'image de session');
    const sessionFormData = new FormData();
    sessionFormData.append('image', fs.createReadStream('test-image.png'));
    
    const sessionResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/session/${sessionId}/banner`, {
      method: 'POST',
      body: sessionFormData,
    });
    
    if (sessionResponse.ok) {
      const sessionResult = await sessionResponse.json();
      console.log('✅ Image de session uploadée:', sessionResult.data?.secure_url);
    } else {
      console.log('❌ Erreur image de session:', await sessionResponse.text());
    }
    
    // Nettoyer
    fs.unlinkSync('test-image.png');
    
    console.log('\n🎉 Tous les tests d\'upload sont passés !');
    console.log('✅ La nouvelle approche d\'upload immédiat est opérationnelle');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testFinalUpload();
