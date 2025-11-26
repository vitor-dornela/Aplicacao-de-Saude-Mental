# 🧠 Aplicação de Saúde Mental

> Mental Health Self-Assessment Application with AI-Powered Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4.svg)](https://ai.google.dev/)

## 📋 Overview

A comprehensive mental health self-assessment tool that guides users through a wellness questionnaire and generates personalized reports with AI-powered analysis, risk assessment, and recommendations.

**Key Features:**
- 🌐 Bilingual support (Portuguese & English)
- 🤖 AI-powered analysis using Google Gemini
- 📊 Personalized risk assessment and recommendations
- 💡 Psychoeducational content
- 🔒 Privacy-focused (no data stored)
- 🖨️ Print/Save reports

## 🏗️ Project Structure

```
Aplicação de Saúde Mental/
├── frontend/                    # React + Vite frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── QuestionnaireForm.tsx
│   │   │   └── ReportView.tsx
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   └── App.tsx              # Main application
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Node.js + Express backend API
│   ├── src/
│   │   ├── index.ts             # Express server
│   │   ├── gemini.ts            # Gemini AI integration
│   │   ├── prompts.ts           # AI system prompts
│   │   └── types.ts             # Zod validation schemas
│   ├── package.json
│   └── .env                     # Environment variables
│
├── docs/                        # Documentation
│   ├── PROJECT_STATUS.md        # Implementation tracking
│   └── GEMINI_PROMPT_DESIGN.md  # AI prompt engineering
│
├── .github/
│   └── copilot-instructions.md  # AI coding guidelines
│
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Aplicação de Saúde Mental"
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Configure environment variables**
   
   Backend (`backend/.env`):
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```
   
   Frontend (`frontend/.env.local`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Start the applications**
   
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend Health: http://localhost:3001/health

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| TypeScript | Type Safety |
| Google Gemini | AI Analysis |
| Zod | Validation |
| Helmet | Security |

## 📱 Application Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Welcome Screen │ ──▶ │  Questionnaire   │ ──▶ │  Report View    │
│  (Language Sel) │     │  (10 Questions)  │     │  (AI Analysis)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────────┐
                                                  │  Backend API    │
                                                  │  (Gemini AI)    │
                                                  └─────────────────┘
```

## 🔒 Privacy & Security

- **No data storage**: All analysis is done in real-time, no data is persisted
- **Rate limiting**: API requests are rate-limited to prevent abuse
- **CORS protected**: Backend only accepts requests from authorized origins
- **Secure headers**: Helmet.js provides security headers

## ⚠️ Disclaimer

This application is for **educational and self-awareness purposes only**. It is **NOT** a medical diagnosis tool. If you are experiencing mental health issues, please seek help from qualified professionals:

- 🇧🇷 **Brazil**: CVV - 188 (24h, free)
- 🇺🇸 **USA**: 988 Suicide & Crisis Lifeline

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

**Made with ❤️ for mental health awareness**
