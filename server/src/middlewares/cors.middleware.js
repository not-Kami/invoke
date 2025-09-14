import cors from 'cors';
import env from '../config/dotenv.config.js';

const allowedOrigins = (env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, '')) // retire slash final
  .filter(Boolean);

// Si aucune URL n'est configurée, autoriser tous les domaines (pour le développement)
const corsOptions = {
  origin: function (origin, callback) {
    
    // En développement, autoriser toutes les origines locales
    if (env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // En staging, autoriser spécifiquement le frontend Render
    if (env.NODE_ENV === 'staging' || origin === 'https://dev-invoke.onrender.com') {
      return callback(null, true);
    }
    
    // Si aucune origine ou si FRONTEND_URLS n'est pas configuré, autoriser
    if (!origin || allowedOrigins.length === 0) {
      return callback(null, true);
    }
    
    // On retire le slash final de l'origin pour la comparaison
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'Cookie'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  maxAge: 86400
};

export default cors(corsOptions); 