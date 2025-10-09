# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

esa to page is a Next.js 15 application that publishes selected esa.io articles to the public web. It's deployed on Cloudflare Workers using OpenNext and provides a secure admin interface for managing published articles.

## Core Purpose

- Selectively publish esa.io articles to make them publicly accessible
- Provide OAuth-based admin interface for article management
- Cache articles in Cloudflare KV for optimal performance
- Support full esa markdown rendering with syntax highlighting

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build production application
npm run build

# Preview Cloudflare Workers build locally
npm run preview

# Deploy to Cloudflare Workers
npm run deploy

# Run linting
npm run lint

# Type checking
npm run check

# Generate Cloudflare types
npm run cf-typegen
```

## Architecture

### Core Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Deployment**: Cloudflare Workers via OpenNext adapter
- **Database**: Cloudflare D1 for article metadata
- **Cache**: Cloudflare KV for article content
- **Styling**: Tailwind CSS v4.1.1 with PostCSS
- **Language**: TypeScript with strict mode enabled
- **Authentication**: esa OAuth 2.0

### Project Structure
```
/src/
├── app/                    # Next.js App Router
│   ├── [slug]/            # Dynamic article pages
│   ├── admin/             # Admin interface
│   │   ├── components/    # Admin UI components
│   │   └── login/        # OAuth login page
│   ├── api/              # API routes
│   │   ├── articles/     # Article CRUD operations
│   │   └── auth/         # OAuth callbacks
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage listing articles
├── components/           # Shared React components
│   ├── ArticleCard.tsx   # Article preview card
│   ├── ArticleRenderer.tsx # Markdown renderer
│   ├── Header.tsx        # Site header
│   └── Footer.tsx        # Site footer
├── lib/                  # Core utilities
│   ├── auth.ts          # OAuth & session handling
│   ├── cache.ts         # KV cache operations
│   ├── db.ts            # D1 database queries
│   └── esa-api.ts       # esa API client
└── types/               # TypeScript definitions
    ├── article.ts       # Article interfaces
    └── esa.ts          # esa API types
```

### Key Features Implementation

#### Authentication Flow
1. Admin clicks "Login with esa" → redirects to esa OAuth
2. esa redirects back with code → exchange for access token
3. Create encrypted session cookie → redirect to admin panel
4. All admin routes check session validity

#### Article Publishing Flow
1. Admin enters esa URL (e.g., `https://workspace.esa.io/posts/123`)
2. System parses workspace and post ID
3. Fetches article via esa API
4. Stores metadata in D1, content in KV
5. Article becomes accessible at `/[slug]`

#### Caching Strategy
- Articles cached in KV for 24 hours
- Cache key: `esa_article_${workspace}_${postId}`
- Manual refresh available via admin panel
- Auto-invalidation on article updates

### Database Schema

```sql
CREATE TABLE published_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  esa_post_id INTEGER NOT NULL,
  workspace TEXT NOT NULL,
  esa_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables & Secrets

Required in Cloudflare Workers:
- `ESA_ACCESS_TOKEN` - Personal access token for esa API
- `ESA_CLIENT_ID` - OAuth application client ID
- `ESA_CLIENT_SECRET` - OAuth application client secret
- `SESSION_SECRET` - Random string for session encryption
- `ESA_WORKSPACE` - Your esa workspace name (in vars)

### API Endpoints

#### Public
- `GET /[slug]` - View published article
- `GET /` - List all published articles

#### Protected (requires auth)
- `GET /api/articles` - List published articles (JSON)
- `POST /api/articles` - Publish new article
- `PUT /api/articles/[id]` - Update article slug
- `DELETE /api/articles/[id]` - Unpublish article
- `POST /api/articles/refresh/[slug]` - Refresh article cache

#### Auth
- `GET /api/auth/login` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/logout` - Clear session

### Development Guidelines

1. **TypeScript**: Use strict typing, avoid `any`
2. **Components**: Prefer server components, use client components only when needed
3. **Styling**: Use Tailwind utilities, avoid custom CSS
4. **Error Handling**: Always handle API errors gracefully
5. **Security**: Never expose secrets, validate all inputs

### Testing Locally

Development mode (`npm run dev`) limitations:
- No access to D1/KV (shows placeholder message)
- No real OAuth (use preview mode for testing)

Use preview mode (`npm run preview`) for full functionality with local Cloudflare environment.

### Deployment Process

1. `npm run build` - Creates Next.js production build
2. OpenNext transforms for Cloudflare Workers
3. `npm run deploy` - Wrangler deploys to Cloudflare
4. Access at configured custom domain or `*.workers.dev`

### Common Tasks

#### Add a new API endpoint
1. Create route file in `/src/app/api/`
2. Import `getCloudflareContext` for env access
3. Add authentication check if needed
4. Handle errors with appropriate status codes

#### Modify article rendering
1. Edit `/src/components/ArticleRenderer.tsx`
2. Styles are in `/src/app/globals.css`
3. Test with various esa markdown features

#### Update admin UI
1. Components in `/src/app/admin/components/`
2. Follow existing patterns for forms and modals
3. Use Tailwind classes for consistency

### Troubleshooting

- **"Cannot read D1 in development"**: Use `npm run preview`
- **OAuth redirect fails**: Check callback URL configuration
- **Articles not updating**: Clear KV cache or use refresh button
- **Build fails**: Run `npm run check` for TypeScript errors

# Important Notes 
If Codex MCP is available in your environment, use it when proceeding with the actual implementation.
As an option,
use Codex MCP with
`workspace-write` for the workspace
and `never` for the approval policy.
Also, break tasks assigned to Codex into smaller pieces and submit them individually to make progress easier to track.
Furthermore, when issuing instructions to Codex, do so in English.
On top of that, have Codex handle Git commits as well.

Translated with DeepL.com (free version)