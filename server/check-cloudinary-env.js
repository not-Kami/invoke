import env from './src/config/dotenv.config.js';

console.log('🔍 Variables Cloudinary:');
console.log('CLOUDINARY_CLOUD_NAME:', env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing');
console.log('CLOUDINARY_API_KEY:', env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
console.log('CLOUDINARY_API_SECRET:', env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

if (env.CLOUDINARY_CLOUD_NAME) {
  console.log('Cloud name value:', env.CLOUDINARY_CLOUD_NAME);
}
if (env.CLOUDINARY_API_KEY) {
  console.log('API key value:', env.CLOUDINARY_API_KEY);
}
if (env.CLOUDINARY_API_SECRET) {
  console.log('API secret value:', env.CLOUDINARY_API_SECRET);
}
