/**
 * Simple script to test the TinyPNG API connection
 * Run with: node test-api-connection.js
 */
const tinify = require('tinify');
require('dotenv').config();

// Get API key from environment variables
const apiKey = process.env.TINYPNG_API_KEY;

if (!apiKey) {
  console.error('Error: TinyPNG API key not found in environment variables');
  console.log('Make sure you have TINYPNG_API_KEY defined in your .env file');
  process.exit(1);
}

console.log('Testing TinyPNG API connection...');

// Set the API key
tinify.key = apiKey;

// Validate the API key
tinify.validate()
  .then(() => {
    console.log('✓ API key is valid');
    console.log(`✓ Compressions this month: ${tinify.compressionCount}`);
    console.log(`✓ Remaining compressions: ${500 - tinify.compressionCount} (free tier limit: 500/month)`);
    console.log('API connection test successful!');
  })
  .catch(error => {
    console.error('✗ API validation failed:', error.message);
    if (error.status === 401) {
      console.log('The API key is invalid or has expired. Get a new key from: https://tinypng.com/developers');
    }
  });
