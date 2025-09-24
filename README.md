# Oraimo SmartScan Admin Dashboard

![Oraimo SmartScan](https://img.shields.io/badge/Oraimo-SmartScan-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjIwQzE0IDIxLjEgMTMuMSAyMiAxMiAyMkw0IDIyQzIuOSAyMiAyIDIxLjEgMiAyMFY0QzIgMi45IDIuOSAyIDQgMkgxMkMxMy4xIDIgMTQgMi45IDE0IDRWNFoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+)

A professional administration dashboard for the Oraimo SmartScan platform, featuring AI-powered product detection and comprehensive inventory management system.

## 🚀 Features

- **AI-Powered Product Detection**: Advanced machine learning for accurate product identification
- **Real-time Inventory Management**: Live stock tracking and movement monitoring
- **User Management**: Complete user administration with role-based access control
- **Analytics Dashboard**: Comprehensive reporting and data visualization
- **Secure Authentication**: JWT-based authentication with admin-only access
- **Responsive Design**: Mobile-first design with modern UI/UX
- **PWA Support**: Installable web app with offline capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Context + Hooks
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel/Netlify/Azure

## 📋 Prerequisites

- Node.js 18+
- npm or pnpm
- Backend API running on Azure

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/AymanIbnouennadre/Oraimo_Dashboard.git
   cd Oraimo_Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net
   NODE_ENV=production
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts
- `npm run preview` - Preview production build

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `VERCEL_ANALYTICS_ID` | Vercel Analytics ID | No |

### Build Configuration

The project is optimized for production with:
- Image optimization and WebP/AVIF support
- Security headers (CSP, X-Frame-Options, etc.)
- Compression enabled
- Bundle analysis available with `npm run build:analyze`

## 🏗️ Project Structure

```
oraimo-smartscan-admin/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix)
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── layout/           # Layout components
├── lib/                  # Utilities and services
│   ├── services/         # API services
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   ├── favicon.ico      # Favicon
│   ├── manifest.json    # PWA manifest
│   └── robots.txt       # SEO robots
└── styles/              # Global styles
```

## 🔒 Security Features

- **Content Security Policy**: Strict CSP headers
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Controls referrer information
- **Permissions Policy**: Restricts browser features
- **Secure Cookies**: HttpOnly and Secure flags

## 📱 Progressive Web App (PWA)

The dashboard is fully PWA-compatible with:
- Web App Manifest
- Service Worker (planned)
- Install prompt
- Offline capabilities (planned)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software owned by Oraimo.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Oraimo SmartScan Admin Dashboard** - Professional inventory management powered by AI.
