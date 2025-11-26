import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { QuestionnaireSchema, ApiResponse, AnalysisResult } from './types.js';
import { analyzeQuestionnaire } from './gemini.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// JSON parser
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests per window
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    console.log('Received analyze request');
    
    // Validate input
    const parseResult = QuestionnaireSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      console.log('Validation failed:', parseResult.error.errors);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid input data: ' + parseResult.error.errors.map(e => e.message).join(', '),
      };
      return res.status(400).json(response);
    }

    const input = parseResult.data;
    console.log('Input validated, calling Gemini...');
    
    // Analyze with Gemini
    const analysis = await analyzeQuestionnaire(input);
    console.log('Gemini response received');

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      data: analysis,
    };

    return res.json(response);

  } catch (error) {
    console.error('Analysis error:', error instanceof Error ? error.message : error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'An error occurred while processing your request. Please try again.',
    };
    
    return res.status(500).json(response);
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Mental Health API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 CORS enabled for: ${corsOrigins.join(', ')}`);
  console.log(`⏱️  Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} requests per ${(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 60000)} minutes`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
