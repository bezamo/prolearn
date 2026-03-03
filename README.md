# ProLearn — Training Management Platform

A modern SaaS training platform for outsourcing companies to onboard and train agents.

## Stack
- **Frontend**: React 18 + Vite
- **Hosting**: Netlify (auto-deploy from GitHub)
- **Styling**: CSS custom properties (zero dependencies)

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Netlify

1. Push this repo to GitHub
2. Connect to Netlify → "Add new site from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

## Demo Credentials
- **Admin**: Click "Sign in as Admin"
- **Agent**: Click "Sign in as Agent"

## Features
### Admin
- Dashboard with analytics
- Module & lesson builder with drag-and-drop reorder
- Client organization
- Agent management & invites
- Training assignments
- Signature & compliance records
- Completion reports (CSV/PDF export)

### Agent
- My Training dashboard
- Lesson-by-lesson progress
- Digital signature acknowledgment
- Certificate of completion

## Roadmap
- [ ] Neon Postgres integration (via Netlify Functions)
- [ ] Real authentication (JWT)
- [ ] File uploads to Cloudflare R2
- [ ] Email invites via Resend
- [ ] PDF certificate generation
- [ ] Real-time progress updates
