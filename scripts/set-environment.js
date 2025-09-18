#!/usr/bin/env node

/**
 * Script principal pour configurer l'environnement complet (décentralisé)
 * Usage: node scripts/set-environment.js [development|staging|production]
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.argv[2] || 'development';
const validEnvs = ['development', 'staging', 'production'];

if (!validEnvs.includes(environment)) {
  console.error(`❌ Environnement invalide: ${environment}`);
  console.error(`✅ Environnements valides: ${validEnvs.join(', ')}`);
  process.exit(1);
}

console.log(`🚀 Configuration de l'environnement: ${environment.toUpperCase()}`);
console.log('='.repeat(60));

try {
  // Configuration du serveur
  console.log('\n📡 Configuration du serveur...');
  execSync(`cd server && node scripts/set-env.js ${environment}`, { 
    stdio: 'inherit'
  });
  
  // Configuration du client
  console.log('\n💻 Configuration du client...');
  execSync(`cd client && node scripts/set-env.js ${environment}`, { 
    stdio: 'inherit'
  });
  
  console.log('\n✅ Configuration terminée !');
  console.log(`🎯 Environnement actuel: ${environment.toUpperCase()}`);
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. Redémarrer le serveur: npm run dev (dans /server)');
  console.log('   2. Redémarrer le client: npm run dev (dans /client)');
  console.log('   3. Vérifier la configuration dans les logs');
  
} catch (error) {
  console.error('❌ Erreur lors de la configuration:', error.message);
  process.exit(1);
}