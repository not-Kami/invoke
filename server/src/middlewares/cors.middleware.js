import cors from 'cors';
import env from '../config/dotenv.config.js';

const allowedOrigins = (env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, '')) // retire slash final
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // On retire le slash final de l'origin pour la comparaison
    const normalizedOrigin = origin.replace(/\/$/, '');
    console.log('CORS DEBUG:', { origin, normalizedOrigin, allowedOrigins });
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
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  maxAge: 86400
};

export default cors(corsOptions); 