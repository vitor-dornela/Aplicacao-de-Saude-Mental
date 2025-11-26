# Copilot Instructions - Mental Health Application

## Architecture Overview

**Monorepo** with React frontend + Node.js/Express backend using Google Gemini AI for mental health self-assessment analysis.

```
frontend/   → React + Vite + TypeScript (port 3000/5173)
backend/    → Express + Gemini AI (port 3001)
docs/       → Project documentation
```

### Data Flow
```
WelcomeScreen → QuestionnaireForm → ReportView
                      ↓                  ↓
               (10 questions)    POST /api/analyze
                                       ↓
                               Gemini AI Analysis
                                       ↓
                               JSON AnalysisResult
```

## Quick Start

```bash
# Backend (Terminal 1)
cd backend && npm install && npm run dev

# Frontend (Terminal 2)  
cd frontend && npm install && npm run dev
```

**Required**: Create `backend/.env` with `GEMINI_API_KEY=your_key` (get from [aistudio.google.com](https://aistudio.google.com/))

## Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | - | Google Gemini API key |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `CORS_ORIGIN` | No | `localhost:3000,localhost:5173` | Comma-separated allowed origins |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` (15 min) | Rate limit window in ms |
| `RATE_LIMIT_MAX_REQUESTS` | No | `10` | Max requests per window |

### Frontend (`frontend/.env.local`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:3001` | Backend API URL |

## Critical Conventions

### Type Synchronization
Types are **duplicated** between frontend and backend (not shared):
- `frontend/src/types/api.ts` - Frontend interfaces
- `backend/src/types.ts` - Zod schemas + interfaces

**When modifying API response structure**: Update both files and ensure Zod schema matches interfaces.

### Zod Validation Pattern
Backend uses Zod for strict input validation. All 10 questionnaire fields use `z.enum()`:
```typescript
// backend/src/types.ts
mood: z.enum(['very-good', 'good', 'neutral', 'bad', 'very-bad']),
hopelessness: z.enum(['optimistic', 'neutral', 'some-worry', 'hopeless', 'very-dark']),
```
Adding new enum values requires updating both Zod schema AND frontend question options.

### Bilingual Support (pt/en)
All user-facing text supports Portuguese and English:
- Frontend: Translation objects in each component (e.g., `translations.pt`, `translations.en`)
- Backend: Separate system prompts `SYSTEM_PROMPT_PT` / `SYSTEM_PROMPT_EN` in `prompts.ts`
- API: `language` field in request body controls response language

### shadcn/ui Components
`frontend/src/components/ui/` contains shadcn library code:
- **DO NOT modify** these files - treat as external library
- Customize via `className` props using Tailwind
- Use `cn()` from `@/components/ui/utils` to merge classes

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | State machine: `welcome → questionnaire → report` |
| `frontend/src/services/api.ts` | Backend API client |
| `backend/src/gemini.ts` | Gemini AI integration with fallback responses |
| `backend/src/prompts.ts` | AI system prompts (bilingual) + JSON schema |
| `backend/src/types.ts` | Zod validation schemas for API input |
| `docs/GEMINI_PROMPT_DESIGN.md` | **Deep dive**: Prompt engineering strategy, field analysis rules, risk calculation logic |

## Modification Patterns

### Adding a New Question
1. Add to `QuestionnaireData` type in `frontend/src/App.tsx`
2. Add question object to `questionsPt` and `questionsEn` arrays in `QuestionnaireForm.tsx`
3. Add Zod validation in `backend/src/types.ts` (`QuestionnaireSchema`)
4. Update field analysis section in `backend/src/prompts.ts`

### Modifying AI Behavior
- Risk calculation rules: Edit `SYSTEM_PROMPT_PT/EN` in `backend/src/prompts.ts`
- Response format: Update `JSON_SCHEMA` in prompts.ts + both type files
- Fallback responses (API failure): Edit `getFallbackResponse()` in `backend/src/gemini.ts`
- **Full prompt engineering docs**: See `docs/GEMINI_PROMPT_DESIGN.md`

### Crisis Detection
`backend/src/prompts.ts` exports `containsCrisisKeywords()` - checks open responses for crisis indicators. Backend auto-flags `urgentHelp: true` when:
- `hopelessness === 'very-dark'`
- Crisis keywords detected in `openResponse`

## Debugging & Testing

### Health Check
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test API Directly
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"mood":"good","sleep":"good","energy":"normal","concentration":"good","socialInteraction":"normal","appetite":"normal","hopelessness":"optimistic","anxiety":"occasional","physicalSymptoms":"minimal","dailyActivities":"normal","language":"pt"}'
```

### Backend Logs
Backend logs to console: validation errors, Gemini API calls, and errors. Check terminal running `npm run dev`.

### Common Issues
| Issue | Solution |
|-------|----------|
| CORS errors | Check `CORS_ORIGIN` env var includes frontend URL |
| 429 Too Many Requests | Rate limited - wait 15 min or adjust `RATE_LIMIT_*` vars |
| Gemini API error | Check `GEMINI_API_KEY` is valid, check backend console for details |
| Empty analysis | Gemini returned invalid JSON - `getFallbackResponse()` used instead |

## API Contract

```typescript
// POST /api/analyze
Request: QuestionnaireSchema (10 enum fields + openResponse + language)
Response: { success: boolean, data?: AnalysisResult, error?: string }

// AnalysisResult structure
{ riskLevel, urgentHelp, summary, mainConcerns[], positiveAspects[], 
  suggestedTopics[], psychoEducation, recommendations[], crisisResources }
```

## Styling

- **Theme**: Purple/pink/blue gradients (`from-purple-500 to-pink-500`)
- **Risk colors**: green (low), yellow (moderate), orange (high), red (urgent)
- **Icons**: lucide-react exclusively
- **Path alias**: `@` → `./src` (configured in vite.config.ts)

## Ethics & Safety

- Maintain **"Este não é um diagnóstico médico"** disclaimer in all user-facing screens
- Never use diagnostic language in prompts ("you have depression" → "symptoms may indicate...")
- Always include crisis resources (CVV 188 for Brazil, 988 for US) when `urgentHelp: true`
- **Icons**: lucide-react exclusively
- **Path alias**: `@` → `./src` (configured in vite.config.ts)

## Ethics & Safety

- Maintain **"Este não é um diagnóstico médico"** disclaimer in all user-facing screens
- Never use diagnostic language in prompts ("you have depression" → "symptoms may indicate...")
- Always include crisis resources (CVV 188 for Brazil, 988 for US) when `urgentHelp: true`
