# HebronAI v2 🤖

[![CI](https://github.com/Osama-Qonaibe/hebronai-v2/actions/workflows/pr-check.yml/badge.svg)](https://github.com/Osama-Qonaibe/hebronai-v2/actions/workflows/pr-check.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.12.0-green.svg)](https://github.com/Osama-Qonaibe/hebronai-v2/releases)

> Enterprise-grade AI chatbot platform built with Next.js 16, TypeScript, and modern AI frameworks.

## 🌟 Features

- 🔐 **Authentication** - Secure user management with NextAuth.js
- 🤖 **Multi-Model AI** - Support for OpenAI, Anthropic, Google, and more
- 🌍 **Internationalization** - Multi-language support (English, Arabic, etc.)
- 💾 **PostgreSQL Database** - Robust data persistence with Drizzle ORM
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and shadcn/ui
- 📦 **File Storage** - S3-compatible storage integration
- 🔄 **Real-time Updates** - Live chat with streaming responses
- 🧪 **Testing** - E2E tests with Playwright
- 📊 **MCP Integration** - Model Context Protocol support

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm 8+

### Installation

```bash
# Clone repository
git clone https://github.com/Osama-Qonaibe/hebronai-v2.git
cd hebronai-v2

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Setup database
pnpm db:push

# Run development server
pnpm dev
```

## 📦 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Using PM2

```bash
pm2 start ecosystem.config.js
```

### Docker

```bash
docker compose up -d
```

## 🔧 Configuration

See [`.env.example`](.env.example) for all available environment variables.

Key configurations:
- Database connection (PostgreSQL)
- AI model API keys
- Authentication providers
- Storage configuration
- MCP server settings

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Agents Documentation](AGENTS.md)
- [Changelog](CHANGELOG.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **AI:** Vercel AI SDK, OpenAI, Anthropic, Google
- **Auth:** NextAuth.js
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **State:** Zustand
- **Testing:** Playwright, Vitest
- **Deployment:** Vercel, PM2, Docker

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

Based on [better-chatbot](https://github.com/better-chatbot/better-chatbot) with significant modifications by HebronAI.

## 🔗 Links

- **Live Demo:** [https://www.hebronai.net](https://www.hebronai.net)
- **GitHub:** [Osama-Qonaibe/hebronai-v2](https://github.com/Osama-Qonaibe/hebronai-v2)
- **Issues:** [Report a bug](https://github.com/Osama-Qonaibe/hebronai-v2/issues)

---

Built with ❤️ by [Osama Qonaibe](https://github.com/Osama-Qonaibe)