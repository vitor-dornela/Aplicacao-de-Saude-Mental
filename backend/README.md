# Mental Health Backend API

Backend service for the Mental Health Self-Assessment Application. Uses Google Gemini AI to analyze questionnaire responses and generate personalized wellness reports.

## Features

- 🤖 **AI-Powered Analysis**: Uses Gemini 1.5 Flash for intelligent response analysis
- 🔒 **Safety First**: Crisis detection, rate limiting, and security headers
- 🌍 **Bilingual**: Supports Portuguese (pt) and English (en)
- ⚡ **Fast**: Optimized for quick response times
- 🛡️ **Secure**: Helmet, CORS, and input validation with Zod

## Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T00:00:00.000Z"
}
```

### `POST /api/analyze`
Analyze questionnaire responses.

**Request Body:**
```json
{
  "mood": "good",
  "sleep": "good",
  "energy": "normal",
  "concentration": "good",
  "socialInteraction": "normal",
  "appetite": "normal",
  "hopelessness": "optimistic",
  "anxiety": "occasional",
  "physicalSymptoms": "minimal",
  "dailyActivities": "normal",
  "openResponse": "",
  "language": "pt"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "riskLevel": "low",
    "urgentHelp": false,
    "summary": "...",
    "mainConcerns": [],
    "positiveAspects": ["..."],
    "suggestedTopics": [],
    "psychoEducation": {...},
    "recommendations": [...],
    "crisisResources": {...}
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | localhost:3000,localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 10 |

## Deployment

### Render (Recommended - Free Tier)

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `GEMINI_API_KEY` and `CORS_ORIGIN`

### Railway (Alternative)

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables in Settings

## License

MIT
