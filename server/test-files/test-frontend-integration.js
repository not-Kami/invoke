import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

async function testFrontendIntegration() {
  try {
    console.log('🧪 Test d\'intégration frontend avec la nouvelle API...');
    
    const gameId = '689dacaac99b92d359649615';
    
    // Créer des images de test
    const logoData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const portraitData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const bannerData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    fs.writeFileSync('test-logo.png', Buffer.from(logoData, 'base64'));
    fs.writeFileSync('test-portrait.png', Buffer.from(portraitData, 'base64'));
    fs.writeFileSync('test-banner.png', Buffer.from(bannerData, 'base64'));
    
    // Simuler le comportement du frontend : upload immédiat
    console.log('\n📤 Simulation frontend : Upload logo');
    const logoFormData = new FormData();
    logoFormData.append('image', fs.createReadStream('test-logo.png'));
    
    const logoResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/game/${gameId}/logo`, {
      method: 'POST',
      body: logoFormData,
    });
    
    if (logoResponse.ok) {
      const logoResult = await logoResponse.json();
      console.log('✅ Logo uploadé:', logoResult.data?.secure_url);
      console.log('🎮 Jeu mis à jour:', !!logoResult.data?.game);
    } else {
      console.log('❌ Erreur logo:', await logoResponse.text());
      return;
    }
    
    // Simuler le comportement du frontend : upload portrait
    console.log('\n📤 Simulation frontend : Upload portrait');
    const portraitFormData = new FormData();
    portraitFormData.append('image', fs.createReadStream('test-portrait.png'));
    
    const portraitResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/game/${gameId}/portrait`, {
      method: 'POST',
      body: portraitFormData,
    });
    
    if (portraitResponse.ok) {
      const portraitResult = await portraitResponse.json();
      console.log('✅ Portrait uploadé:', portraitResult.data?.secure_url);
      console.log('🎮 Jeu mis à jour:', !!portraitResult.data?.game);
    } else {
      console.log('❌ Erreur portrait:', await portraitResponse.text());
      return;
    }
    
    // Simuler le comportement du frontend : upload banner
    console.log('\n📤 Simulation frontend : Upload banner');
    const bannerFormData = new FormData();
    bannerFormData.append('image', fs.createReadStream('test-banner.png'));
    
    const bannerResponse = await fetch(`http://localhost:3000/api/v1/upload/immediate/game/${gameId}/banner`, {
      method: 'POST',
      body: bannerFormData,
    });
    
    if (bannerResponse.ok) {
      const bannerResult = await bannerResponse.json();
      console.log('✅ Banner uploadé:', bannerResult.data?.secure_url);
      console.log('🎮 Jeu mis à jour:', !!bannerResult.data?.game);
    } else {
      console.log('❌ Erreur banner:', await bannerResponse.text());
      return;
    }
    
    // Vérifier le résultat final
    console.log('\n🔍 Vérification finale : Récupération du jeu');
    const gameResponse = await fetch(`http://localhost:3000/api/v1/games/${gameId}`);
    
    if (gameResponse.ok) {
      const gameResult = await gameResponse.json();
      console.log('🎮 État final du jeu:');
      console.log('  - Logo:', gameResult.data?.images?.logo ? '✅ Présent' : '❌ Manquant');
      console.log('  - Portrait:', gameResult.data?.images?.portrait ? '✅ Présent' : '❌ Manquant');
      console.log('  - Banner:', gameResult.data?.images?.banner ? '✅ Présent' : '❌ Manquant');
      
      if (gameResult.data?.images?.logo && gameResult.data?.images?.portrait && gameResult.data?.images?.banner) {
        console.log('\n🎉 SUCCÈS : Toutes les images sont présentes !');
        console.log('✅ La nouvelle approche fonctionne parfaitement !');
      } else {
        console.log('\n❌ ÉCHEC : Certaines images sont manquantes');
      }
    } else {
      console.log('❌ Impossible de récupérer le jeu');
    }
    
    // Nettoyer
    fs.unlinkSync('test-logo.png');
    fs.unlinkSync('test-portrait.png');
    fs.unlinkSync('test-banner.png');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testFrontendIntegration();
