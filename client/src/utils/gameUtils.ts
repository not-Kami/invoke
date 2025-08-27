/**
 * Normalise le nom d'un jeu pour créer un identifiant unique et sécurisé
 * Utilisé pour les dossiers d'upload et les URLs
 */
export const normalizeGameName = (gameName: string): string => {
  return gameName
    .toLowerCase()
    .trim()
    // Remplacer les caractères spéciaux par des tirets
    .replace(/[^a-z0-9\s-]/g, '')
    // Remplacer les espaces multiples par des tirets
    .replace(/\s+/g, '-')
    // Supprimer les tirets multiples
    .replace(/-+/g, '-')
    // Supprimer les tirets en début et fin
    .replace(/^-|-$/g, '');
};

/**
 * Génère un identifiant unique pour un jeu
 * Format: {nom-normalise}-{timestamp}
 */
export const generateGameId = (gameName: string): string => {
  const normalized = normalizeGameName(gameName);
  const timestamp = Date.now();
  return `${normalized}-${timestamp}`;
};

/**
 * Vérifie si un nom de jeu est valide
 */
export const isValidGameName = (gameName: string): boolean => {
  return gameName.trim().length >= 2 && gameName.trim().length <= 100;
};

/**
 * Exemples de normalisation
 */
export const gameNameExamples = [
  { original: "Dungeons & Dragons 5e", normalized: "dungeons-dragons-5e" },
  { original: "Call of Cthulhu 7e", normalized: "call-of-cthulhu-7e" },
  { original: "Pathfinder 2e", normalized: "pathfinder-2e" },
  { original: "Vampire: The Masquerade V5", normalized: "vampire-the-masquerade-v5" },
  { original: "Star Wars: Edge of the Empire", normalized: "star-wars-edge-of-the-empire" }
];
