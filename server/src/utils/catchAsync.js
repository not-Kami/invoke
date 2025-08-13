/**
 * Wrapper pour gérer les erreurs asynchrones dans les controllers
 * @param {Function} fn - Fonction asynchrone à wrapper
 * @returns {Function} - Fonction wrapper qui gère les erreurs
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
