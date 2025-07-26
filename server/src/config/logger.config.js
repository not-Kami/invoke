import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import env from './dotenv.config.js';

// Configuration des transports selon l'environnement
const transports = [];

// Transport console (toujours présent)
transports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })
        )
    })
);

// Transport fichier avec rotation pour staging/prod
if (env.NODE_ENV !== 'development') {
    // Transport pour les logs généraux
    transports.push(
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d', // Garder 14 jours
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            )
        })
    );

    // Transport pour les erreurs uniquement
    transports.push(
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d', // Garder 30 jours pour les erreurs
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            )
        })
    );
}

// Logger principal
const logger = winston.createLogger({
    level: env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'invoke-backend' },
    transports,
    exitOnError: false
});

// Logger pour les requêtes HTTP
export const httpLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'invoke-backend', type: 'http' },
    transports,
    exitOnError: false
});

export default logger; 