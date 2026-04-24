require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary Config...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('ERROR: Cloudinary credentials are missing in .env');
    process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping()
    .then(res => {
        console.log('Cloudinary Ping Result:', res);
        console.log('SUCCESS: Cloudinary is configured correctly.');
    })
    .catch(err => {
        console.error('Cloudinary Ping Failed:', err.message);
    });
