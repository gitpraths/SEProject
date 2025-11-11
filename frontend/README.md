# 🏠 NEST - Homeless People Aid & Management System

> A comprehensive humanitarian aid platform connecting homeless individuals with essential resources, support networks, and opportunities for stability.

**Developed by:** Amrita School of Computing  
**Version:** 1.0.0  
**Academic Project:** Software Engineering

---

## 📋 Project Overview

NEST (Nurturing Essential Support & Transition) is a full-stack web application designed to streamline homeless aid management through digital transformation. The platform enables volunteers, NGOs, and administrators to efficiently manage profiles, resources, and match individuals with appropriate services.

### 🎯 Humanitarian Impact

- **Centralized Data Management**: Single source of truth for homeless individual profiles
- **Resource Optimization**: Real-time tracking of shelter capacity and job availability
- **AI-Powered Matching**: Intelligent recommendations connecting needs with resources
- **Offline-First**: Works without internet, syncs when connected
- **Multilingual**: Accessible in English and Hindi (हिंदी)
- **Mobile-Responsive**: Access from any device, anywhere

---

## ✨ Features Summary

### 🔐 Authentication & Authorization
- Email/Password and OTP-based login
- Role-based access control (Volunteer, NGO, Admin)
- Secure session management with localStorage

### 👥 Profile Management
- 6-step profile creation wizard with validation
- Geolocation with interactive Leaflet maps
- QR code generation for easy profile access
- Photo upload and document management
- Auto-save and draft recovery

### 🏘️ Resource Management
- **Shelters**: Capacity tracking, occupancy management, contact details
- **Jobs**: Full-time/part-time listings, wage information, employer details
- CRUD operations with role-based permissions
- Search, filter, and CSV export capabilities
- Real-time availability updates

### 🎯 AI-Powered Matching
- Smart recommendations based on profile needs
- Compatibility scoring algorithm
- Multi-criteria matching (shelter, job, medical, training)
- Assignment workflow with follow-up integration
- Live statistics dashboard

### 📊 Reports & Analytics
- Interactive charts (Recharts) for data visualization
- Date range filtering (7/30/90 days)
- CSV export for spreadsheet analysis
- PDF report generation with charts
- Real-time statistics and trends

### 📱 Timeline & Follow-ups
- Activity tracking for each profile
- Follow-up scheduling and completion tracking
- Notes and observations logging
- Assignment history

### 🌐 Offline Support
- IndexedDB/LocalForage for local storage
- Pending queue for offline operations
- Automatic sync when online
- Offline banner and sync indicators
- Manual sync trigger

### 🌍 Internationalization
- English and Hindi (हिंदी) support
- Language switcher in navbar
- Persistent language preference
- Translated UI strings for core features

### ⚙️ Settings & Help
- Theme toggle (Light/Dark mode)
- Language selection
- Offline data management
- Comprehensive FAQ section
- Contact support form

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Custom Theme** - Cream/beige/brown humanitarian palette

### State Management & Data Fetching
- **TanStack React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Maps & Geolocation
- **React Leaflet** - Interactive maps
- **OpenStreetMap** - Map tiles and geocoding

### Internationalization
- **i18next** - Translation framework
- **react-i18next** - React bindings
- **i18next-browser-languagedetector** - Language detection

### Offline & Storage
- **LocalForage** - IndexedDB wrapper
- **LocalStorage** - Session and preferences

### API Mocking
- **Mock Service Worker (MSW)** - API mocking for development
- **MSW Browser** - Client-side request interception

### Reports & Export
- **Recharts** - Chart library
- **jsPDF** - PDF generation
- **html2canvas** - Chart to image conversion

### Code Quality
- **ESLint** - Linting
- **TypeScript** - Type checking
- **Prettier** - Code formatting (via Tailwind)

---

## 📁 Directory Structure

```
homeless-aid-platform/frontend/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Role-based dashboards
│   │   ├── volunteer/
│   │   ├── ngo/
│   │   └── admin/
│   ├── profiles/                 # Profile management
│   │   ├── create/
│   │   ├── all/
│   │   └── [id]/
│   ├── resources/                # Resource management
│   │   ├── shelters/
│   │   └── jobs/
│   ├── matches/                  # AI matching system
│   ├── reports/                  # Analytics & reports
│   ├── settings/                 # User settings
│   ├── help/                     # Help & FAQ
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable components
│   ├── Reports/                  # Report components
│   │   ├── ChartsPanel.tsx
│   │   ├── ExportControls.tsx
│   │   └── ReportsHeader.tsx
│   ├── ClientI18nProvider.tsx
│   ├── LayoutWrapper.tsx
│   ├── MapSelector.tsx
│   ├── MatchCard.tsx
│   ├── Navbar.tsx
│   ├── OfflineBanner.tsx
│   ├── ProfileCard.tsx
│   ├── ResourceCard.tsx
│   ├── ResourceModal.tsx
│   └── Sidebar.tsx
│
├── lib/                          # Utilities & helpers
│   ├── analytics.ts              # Analytics utilities
│   ├── api.ts                    # API client functions
│   ├── appInfo.ts                # App metadata
│   ├── i18n.ts                   # i18n configuration
│   ├── offline.ts                # Offline queue management
│   ├── react-query-provider.tsx
│   └── types.ts                  # TypeScript types
│
├── mocks/                        # MSW mock handlers
│   ├── handlers/
│   │   ├── analyticsHandler.ts
│   │   ├── authHandlers.ts
│   │   ├── followupHandlers.ts
│   │   ├── matchesHandler.ts
│   │   ├── profileHandlers.ts
│   │   ├── recommendationsHandler.ts
│   │   └── resourceHandlers.ts
│   └── browser.ts                # MSW setup
│
├── public/                       # Static assets
│   └── mockServiceWorker.js      # MSW worker script
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.js                # Next.js config
└── postcss.config.js             # PostCSS config
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd homeless-aid-platform/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   Note: Use `--legacy-peer-deps` to resolve TypeScript version conflicts.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### First-Time Setup

1. **Initialize MSW** (if needed)
   ```bash
   npx msw init public/ --save
   ```

2. **Access the application**
   - Navigate to `http://localhost:3000`
   - Click "Get Started" to go to login
   - Use any email/password to login (mock authentication)
   - Select a role: Volunteer, NGO, or Admin

---

## 🎨 Design Philosophy

### Color Palette (Humanitarian Theme)
- **Cream** (#FEF7F0) - Primary background
- **Beige** (#F5E6D3) - Secondary background
- **Brown** (#92400E) - Primary text
- **Amber** (#D97706) - Accent color
- **Tan** (#E8DCC4) - Subtle highlights

### Design Principles
- **Warm & Welcoming**: Soft, earthy tones create a compassionate atmosphere
- **Accessible**: High contrast ratios, ARIA labels, keyboard navigation
- **Responsive**: Mobile-first design, works on all screen sizes
- **Consistent**: Unified design language across all pages
- **Minimal**: Clean interfaces reduce cognitive load

---

## 🔧 Mock API Setup (MSW)

All API calls are intercepted by Mock Service Worker for development:

### Available Endpoints

**Authentication**
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/register` - User registration

**Profiles**
- `GET /api/profiles` - List all profiles
- `GET /api/profiles/:id` - Get profile by ID
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

**Resources**
- `GET /api/shelters` - List shelters
- `POST /api/shelters` - Create shelter
- `PUT /api/shelters/:id` - Update shelter
- `DELETE /api/shelters/:id` - Delete shelter
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

**Matches & Analytics**
- `GET /api/matches` - Get AI matches
- `POST /api/matches/assign` - Assign match
- `GET /api/analytics/overview` - Get analytics data
- `GET /api/recommendations` - Get recommendations
- `GET /api/followups` - Get follow-ups
- `POST /api/followups` - Create follow-up

### Data Persistence
- Mock data is stored in `localStorage`
- Persists across page refreshes
- Can be cleared via Settings > Clear Offline Data

---

## 🌐 Offline & Localization

### Offline Functionality
- **Automatic Detection**: Offline banner appears when disconnected
- **Local Queue**: Operations saved to IndexedDB
- **Sync Indicator**: Badge shows pending items count
- **Manual Sync**: "Sync Now" button in Settings/Reports
- **Data Persistence**: All changes preserved until synced

### Language Support
- **English (EN)**: Default language
- **Hindi (हिंदी)**: Full translation for core UI
- **Language Toggle**: Globe icon in navbar
- **Persistent**: Language preference saved to localStorage
- **Fallback**: Graceful fallback to English for missing translations

---

## 👥 Credits

**Development Team**  
Amrita School of Computing

**Open Source Libraries**
- Next.js, React, TypeScript
- Tailwind CSS, Framer Motion
- TanStack React Query
- React Leaflet, OpenStreetMap
- Mock Service Worker
- i18next, LocalForage
- Recharts, jsPDF

**Special Thanks**
- OpenStreetMap Contributors
- MSW Community
- Humanitarian organizations providing domain expertise

---

## 📄 License

This project is developed for academic purposes at Amrita School of Computing.

---

## 📞 Support

For issues, questions, or contributions:
- **Email**: support@nest-aid.org
- **Help Page**: Available in-app at `/help`
- **FAQ**: Comprehensive FAQ section in Help page

---

**Built with ❤️ for humanitarian impact**
