# EnTalk Questions Tool

A conversation question generation system for English language practice events.

## Features

- Generate engaging conversation questions for English language practice
- Organize questions by categories and deck phases
- Location-based question algorithm that selects popular questions from other locations
- User authentication and event management
- Question feedback and performance tracking

## Prerequisites

- Node.js 16 or higher
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_uri
NODE_ENV=production
CORS_ORIGIN=*
```

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the environment variables in the Render dashboard

## API Endpoints

### Authentication
- POST `/api/users` - Register a new user
- POST `/api/auth` - Login user
- GET `/api/auth/user` - Get current user

### Events
- POST `/api/events` - Create a new event
- GET `/api/events` - Get all events for current user
- GET `/api/events/:id` - Get event by ID

### Questions
- POST `/api/questions/generate` - Generate questions with OpenAI
- POST `/api/questions` - Save questions to an event
- GET `/api/questions/:eventId` - Get questions by event ID
- GET `/api/questions/categories` - Get all question categories
- GET `/api/questions/phases` - Get all deck phases

### Locations
- GET `/api/locations` - Get all locations

### Decks
- POST `/api/decks/generate/:locationId` - Generate a deck for a location
- GET `/api/decks/:accessCode` - Get a deck by access code
- GET `/api/decks/active/:locationId` - Get active deck for a location

## License

MIT
