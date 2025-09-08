import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

async function testSessionImageUpload() {
  try {
    console.log('🧪 Test d\'upload d\'image de session...');
    
    const sessionId = '68befbcbc58ae9afe9b1f449';
    
    // Créer une image de test
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    fs.writeFileSync('test-session-image.png', Buffer.from(imageData, 'base64'));
    
    // Test upload d'image de session
    console.log('\n📤 Test: Upload d\'image de session');
    const formData = new FormData();
    formData.append('image', fs.createReadStream('test-session-image.png'));
    
    const response = await fetch(`http://localhost:3000/api/v1/upload/immediate/session/${sessionId}/banner`, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Image de session uploadée:', result.data?.secure_url);
    } else {
      console.log('❌ Erreur:', await response.text());
    }
    
    // Nettoyer
    fs.unlinkSync('test-session-image.png');
    
    console.log('\n🎉 Test d\'upload d\'image de session terminé !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testSessionImageUpload();
