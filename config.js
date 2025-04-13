// Environment variable configuration for Render deployment
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file if it exists
dotenv.config();

// Environment variable validation and defaults
const config = {
  // Server configuration
  port: process.env.PORT || 10000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'entalk_default_jwt_secret_key',
  
  // OpenAI API
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // MongoDB
  mongodbUri: process.env.MONGODB_URI || '',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const missingVars = [];
  
  if (!config.jwtSecret || config.jwtSecret === 'entalk_default_jwt_secret_key') {
    missingVars.push('JWT_SECRET');
  }
  
  if (!config.openaiApiKey) {
    console.warn('WARNING: OPENAI_API_KEY is not set. The application will use mock data for question generation.');
  }
  
  if (missingVars.length > 0) {
    console.warn(`WARNING: The following environment variables are recommended for production: ${missingVars.join(', ')}`);
  }
}

module.exports = config;
