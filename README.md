# 🧠 Aplicação de Saúde Mental

> Aplicação de Autoavaliação de Saúde Mental com Análise por Inteligência Artificial

[![Licença: MIT](https://img.shields.io/badge/Licença-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4.svg)](https://ai.google.dev/)

## 📋 Visão Geral

Uma ferramenta completa de autoavaliação de saúde mental que guia os usuários através de um questionário de bem-estar e gera relatórios personalizados com análise por IA, avaliação de risco e recomendações.

**Principais Funcionalidades:**
- 🌐 Suporte bilíngue (Português e Inglês)
- 🤖 Análise por IA usando Google Gemini
- 📊 Avaliação de risco e recomendações personalizadas
- 💡 Conteúdo psicoeducativo
- 🔒 Foco em privacidade (nenhum dado armazenado)
- 🖨️ Imprimir/Salvar relatórios

## 🏗️ Estrutura do Projeto

```
Aplicação de Saúde Mental/
├── frontend/                    # Aplicação frontend React + Vite
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── ui/              # Componentes shadcn/ui
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── QuestionnaireForm.tsx
│   │   │   └── ReportView.tsx
│   │   ├── services/            # Serviços de API
│   │   ├── types/               # Tipos TypeScript
│   │   └── App.tsx              # Aplicação principal
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # API backend Node.js + Express
│   ├── src/
│   │   ├── index.ts             # Servidor Express
│   │   ├── gemini.ts            # Integração Gemini AI
│   │   ├── prompts.ts           # Prompts do sistema de IA
│   │   └── types.ts             # Esquemas de validação Zod
│   ├── package.json
│   └── .env                     # Variáveis de ambiente
│
├── docs/                        # Documentação
│   ├── PROJECT_STATUS.md        # Acompanhamento da implementação
│   └── GEMINI_PROMPT_DESIGN.md  # Engenharia de prompts de IA
│
├── .github/
│   └── copilot-instructions.md  # Diretrizes de codificação com IA
│
└── README.md                    # Este arquivo
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chave de API do Google Gemini ([Obtenha aqui](https://aistudio.google.com/))

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd "Aplicação de Saúde Mental"
   ```

2. **Instale as dependências**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Backend (`backend/.env`):
   ```env
   PORT=3001
   GEMINI_API_KEY=sua_chave_api_gemini_aqui
   NODE_ENV=development
   ```
   
   Frontend (`frontend/.env.local`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Inicie as aplicações**
   
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Abra no navegador**
   - Frontend: http://localhost:3000
   - Saúde do Backend: http://localhost:3001/health

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Propósito |
|------------|-----------|
| React 18 | Framework de UI |
| TypeScript | Tipagem Estática |
| Vite | Ferramenta de Build |
| Tailwind CSS | Estilização |
| shadcn/ui | Componentes de UI |
| Lucide React | Ícones |

### Backend
| Tecnologia | Propósito |
|------------|-----------|
| Node.js | Runtime |
| Express | Framework Web |
| TypeScript | Tipagem Estática |
| Google Gemini | Análise por IA |
| Zod | Validação |
| Helmet | Segurança |

## 📱 Fluxo da Aplicação

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Tela de Boas   │ ──▶ │   Questionário   │ ──▶ │  Visualização   │
│  Vindas (Idioma)│     │  (10 Perguntas)  │     │  do Relatório   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────────┐
                                                  │   API Backend   │
                                                  │   (Gemini AI)   │
                                                  └─────────────────┘
```

## 🔒 Privacidade e Segurança

- **Sem armazenamento de dados**: Toda análise é feita em tempo real, nenhum dado é persistido
- **Limitação de taxa**: Requisições à API são limitadas para prevenir abuso
- **Proteção CORS**: Backend aceita apenas requisições de origens autorizadas
- **Headers seguros**: Helmet.js fornece headers de segurança

## ⚠️ Aviso Legal

Esta aplicação é apenas para **propósitos educacionais e de autoconhecimento**. **NÃO** é uma ferramenta de diagnóstico médico. Se você está passando por problemas de saúde mental, por favor procure ajuda de profissionais qualificados:

- 🇧🇷 **Brasil**: CVV - 188 (24h, gratuito)
- 🇺🇸 **EUA**: 988 Suicide & Crisis Lifeline

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nossas diretrizes de contribuição antes de enviar PRs.

## 📞 Suporte

Para dúvidas ou problemas, por favor abra uma issue no GitHub ou entre em contato com os mantenedores.

---

**Feito com ❤️ pela conscientização em saúde mental**
