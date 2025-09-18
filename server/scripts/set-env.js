#!/usr/bin/env node

/**
 * Script pour configurer l'environnement automatiquement
 * Usage: node scripts/set-env.js [development|staging|production]
 */

import fs from 'fs';
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

const envFile = `.env.${environment}`;
const envPath = path.join(__dirname, '..', envFile);
const targetPath = path.join(__dirname, '..', '.env');

try {
  // Vérifier que le fichier d'environnement existe
  if (!fs.existsSync(envPath)) {
    console.error(`❌ Fichier d'environnement non trouvé: ${envFile}`);
    process.exit(1);
  }

  // Copier le fichier d'environnement
  fs.copyFileSync(envPath, targetPath);
  
  console.log(`✅ Environnement configuré: ${environment}`);
  console.log(`📁 Fichier copié: ${envFile} → .env`);
  
  // Afficher les variables importantes
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  console.log('\n📋 Configuration actuelle:');
  console.log('─'.repeat(50));
  
  const importantVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'FRONTEND_URLS'];
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      if (importantVars.includes(key)) {
        const value = line.includes('=') ? line.split('=')[1] : '';
        // Masquer les valeurs sensibles
        if (key === 'MONGODB_URI') {
          console.log(`${key}=${value.substring(0, 20)}...`);
        } else {
          console.log(`${key}=${value}`);
        }
      }
    }
  });
  
  console.log('─'.repeat(50));
  
} catch (error) {
  console.error('❌ Erreur lors de la configuration:', error.message);
  process.exit(1);
}
