# Copilot Instructions - Mental Health Application Prototype

## Project Overview
A React + TypeScript mental health self-assessment application built with Vite. The app uses a simple state-machine pattern to guide users through a wellness questionnaire and generate personalized reports with risk analysis and recommendations.

**Origin**: Generated from Figma design using Figma Make (design available at Figma project link in README.md)

## Architecture Pattern

### State Machine Flow
The app uses a single-parent state machine in `App.tsx`:
- **States**: `'welcome' | 'questionnaire' | 'report'` controlled by `currentScreen`
- **Data flow**: State lives in `App.tsx`, flows down via props, callbacks bubble up
- **Navigation**: Screen transitions triggered by callbacks (`onStart`, `onSubmit`, `onRestart`)

Example from `App.tsx`:
```tsx
const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
const [responses, setResponses] = useState<QuestionnaireData | null>(null);
```

### Component Organization
- `/components/`: Screen-level components (WelcomeScreen, QuestionnaireForm, ReportView)
- `/components/ui/`: shadcn/ui primitives (never modify directly - these are from shadcn library)
- `/components/figma/`: Figma-specific utilities (ImageWithFallback)
- `/guidelines/`: Design system documentation (reference for UI decisions)

## Development Workflow

### Running the App
```bash
npm i           # Install dependencies
npm run dev     # Start Vite dev server (default: http://localhost:5173)
npm run build   # Production build
```

### Key Technical Details
- **Build tool**: Vite with SWC plugin for fast React refresh
- **Styling**: Tailwind CSS v4.1.3 (compiled CSS in `src/index.css`)
- **Type safety**: TypeScript with strict mode (no explicit tsconfig - Vite defaults)
- **State management**: React useState hooks (no external state library)
- **Form handling**: react-hook-form for complex multi-step questionnaire

### Vite Alias Configuration
Custom path alias `@` maps to `./src` for imports:
```tsx
import { cn } from '@/components/ui/utils'
```

⚠️ **Important**: `vite.config.ts` contains extensive versioned package aliases (e.g., `'vaul@1.1.2': 'vaul'`) - preserve these when modifying config.

## UI Component Conventions

### shadcn/ui Usage
All `/components/ui/` files are from [shadcn/ui](https://ui.shadcn.com/) (MIT licensed):
- **DO NOT modify** component internals - treat as external library
- Customize via className props and Tailwind utilities
- Use the `cn()` utility from `@/components/ui/utils` to merge class names

Example pattern from codebase:
```tsx
import { Button } from './ui/button';
<Button className="bg-gradient-to-r from-purple-600 to-pink-600">
```

### Color Palette
The app uses a gradient-heavy purple/pink/blue theme:
- Primary gradients: `from-purple-500 to-pink-500`, `from-purple-600 to-pink-600`
- Background: `bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`
- Component accents: purple-100/600, pink-100/600, blue-100/600
- Risk levels: green (low), yellow (moderate), orange (high), red (urgent)

### Icon System
Uses [lucide-react](https://lucide.dev/) for all icons:
```tsx
import { Heart, Brain, AlertTriangle } from 'lucide-react';
```

## Data Model

### Questionnaire Structure
10 mental health questions stored in `QuestionnaireData` type:
```tsx
export type QuestionnaireData = {
  mood: string;
  sleep: string;
  energy: string;
  concentration: string;
  socialInteraction: string;
  appetite: string;
  hopelessness: string;
  anxiety: string;
  physicalSymptoms: string;
  dailyActivities: string;
  openResponse: string;
};
```

Questions are defined in `QuestionnaireForm.tsx` with 5-point Likert scales (e.g., 'very-good' to 'very-bad').

### Report Analysis
`ReportView.tsx` includes a client-side analysis function `analyzeResponses()` that:
- Calculates risk level based on response patterns
- Identifies main concerns and positive aspects
- Generates contextual recommendations
- Provides psychoeducational content
- Determines if urgent help is needed

⚠️ **Critical**: This is a **prototype simulation** - the analysis is rule-based, not AI-powered. The 2-second loading animation in `ReportView` simulates processing but is purely cosmetic.

## File Modification Patterns

### When Adding New Questions
1. Update `QuestionnaireData` type in `App.tsx`
2. Add question object to `questions` array in `QuestionnaireForm.tsx`
3. Update `analyzeResponses()` logic in `ReportView.tsx` to process new response

### When Modifying Styling
- Global styles: Edit `src/styles/globals.css` (base typography, prose styles)
- Tailwind variables: Modify `src/index.css` CSS variables (colors are oklch format)
- Component styles: Use inline Tailwind classes with `className` prop

### When Adding New Screens
Follow the state machine pattern:
1. Add new state to `AppScreen` union type in `App.tsx`
2. Create screen component in `/components/`
3. Add conditional render in `App.tsx` return JSX
4. Implement navigation callbacks

## Special Considerations

### Portuguese Language
All user-facing content is in Brazilian Portuguese (`pt-BR`). Maintain this when adding features.

### No Backend
This is a **client-only** prototype:
- No API calls or data persistence
- Analysis happens in-browser via `analyzeResponses()` function
- Privacy-focused design (data never leaves user's device)

### Accessibility
Follow existing patterns for semantic HTML and ARIA usage from shadcn/ui components. The design prioritizes clarity for sensitive mental health content.

### Legal/Ethical Notice
Per `WelcomeScreen.tsx` alert: "Este não é um diagnóstico médico" (This is not a medical diagnosis). Maintain clear disclaimers about professional help when modifying report content.

## Common Tasks

**Add a new UI component from shadcn**:
```bash
# Components are manually copied from https://ui.shadcn.com/
# Add to src/components/ui/ maintaining existing import patterns
```

**Debug state transitions**:
Check `App.tsx` useState hooks and screen rendering conditions. Use React DevTools to inspect `currentScreen` and `responses` state.

**Customize risk thresholds**:
Edit `analyzeResponses()` function in `ReportView.tsx` (search for score calculation logic).

**Update dependencies**:
Note: `package.json` uses wildcards for some packages (`clsx: "*"`). Pin versions if builds break.
