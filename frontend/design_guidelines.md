# NEST Design Guidelines

## Design Approach
**Reference-Based + Custom System**: Humanitarian aid platform with warm, compassionate aesthetic. Draws inspiration from accessible, trustworthy platforms while maintaining unique identity through custom color palette and humanitarian focus.

## Color System

### Light Mode (Default)
- Background: `#FEF7F0` (cream)
- Cards: `#FFFFFF` with subtle shadow
- Accents: `#D7BFAE` (beige), `#8B5E3C` (brown), `#F1E4D1` (soft tan)
- Buttons: Warm amber-brown gradients (`#B08968` to `#8B5E3C`)
- Text: `#3C2F2F` (deep brown)
- Links/Highlights: `#B36A5E` (earthy orange)

### Dark Mode
- Background: `#1C1917` (deep brown/stone)
- Cards: `#292524` (slightly lighter brown)
- Text: `#F5EDE0` (light cream)
- Accents: `#B08968` (amber), `#D9CAB3` (light beige)

## Typography
- Primary Font: **Poppins**, sans-serif (Google Fonts)
- Hierarchy: Use font weights (400, 500, 600, 700) to establish clear information hierarchy
- Responsive sizing: Scale headings appropriately across devices

## Layout System
- Spacing: Use Tailwind units 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Border Radius: `rounded-2xl` as default for cards and containers
- Shadows: `shadow-lg` with `shadow-amber-100/40` for soft layered depth
- Max widths: Container layouts with appropriate content constraints

## Component Library

### Navigation
- **Navbar**: Horizontal with app name left, user controls right (role, avatar, offline indicator, language toggle, dark mode)
- **Sidebar**: Smooth sliding animation (Framer Motion), role-based dynamic links, Lucide React icons
- Responsive: Collapsible sidebar on mobile

### Cards
- White/cream background with `rounded-2xl` and soft shadows
- Hover: Subtle scale + glow effect (Framer Motion)
- Content: Clear hierarchy with icon, title, metadata, actions

### Forms
- Multi-step wizard with progress bar
- Validation feedback with Zod
- Upload areas with drag-and-drop indication
- Consistent input styling with focus states

### Buttons
- Primary: Warm gradient (`bg-gradient-to-r from-[#B08968] to-[#8B5E3C]`)
- Secondary: Outline with beige/brown
- Hover: Scale transform with soft glow
- Hero Image Buttons: Blurred background (`backdrop-blur-sm bg-white/20`)

### Modals & Overlays
- Centered with backdrop blur
- Slide-up animation on enter
- Clear close actions

### Data Display
- Tables: Alternating row colors, hover states
- Stats Cards: Large numbers, icons, trend indicators
- Graphs: Chart.js/Recharts with warm color palette
- Timeline: Vertical flow with icons, dates, completion states

### Maps
- React Leaflet integration
- Draggable markers for location selection
- Warm custom pin icons

## Animations
- Page Transitions: Fade-in, slide-up (Framer Motion)
- Loading States: Skeleton loaders matching component shapes
- Hover Effects: Subtle scale (1.02-1.05) + glow
- Modal Entry: Slide-up with backdrop fade
- Progress Indicators: Smooth width animations
- Keep animations minimal and purposeful - enhance UX without distraction

## Special Features
- **Offline Indicator**: Green dot (online) / Grey dot (offline) in navbar
- **Language Toggle**: EN/हिंदी with instant switching
- **Dark Mode Toggle**: Sun/moon icon with smooth transition
- **QR Codes**: Generated for profile IDs using qrcode.react
- **Loading Screen**: Full-screen cream background, centered logo with fade-in, progress bar
- **Consent Modal**: Clear privacy messaging before submission
- **Photo Upload**: Drag-and-drop area with preview
- **Toast Notifications**: React Hot Toast with warm color scheme

## Page-Specific Layouts

### Authentication Pages
- Centered card on animated gradient background (cream/beige waves)
- Split layout option: form left, illustration/messaging right
- Clear role selection and OTP display

### Dashboards
- Grid of stat cards (2-4 columns responsive)
- Quick action buttons prominent
- Recent activity/submissions list
- Role-specific content sections

### Profile Creation Wizard
- Fixed progress bar at top
- Single step visible at a time
- Previous/Next navigation
- Draft auto-save indicator
- Success page: Summary card + QR code + digital ID

### Profile View
- Header: Photo, name, key info, action buttons
- Tabbed interface: Overview, Needs, AI Recommendations, Timeline, Documents
- Map section for location
- Editable fields with save confirmation

### Resource Management
- Card grid (2-3 columns)
- Filter/search bar
- Add button floating or prominent
- CRUD modals overlay

### Reports & Analytics
- Stats row at top
- Charts/graphs below with export controls
- Filter controls for date ranges

## Images
- **Hero Sections**: Not applicable (dashboard/app focus)
- **Profile Photos**: Circular avatars, placeholder for empty states
- **Illustrations**: Humanitarian-themed icons and spot illustrations throughout
- **Loading Screen**: App logo (warm, minimal design)

## Accessibility
- WCAG AA color contrast compliance
- Keyboard navigation support
- Screen reader labels
- Focus indicators on interactive elements
- Responsive touch targets (minimum 44x44px)

## Overall Aesthetic
Minimal, warm, humanitarian, elegant. Evokes trust, compassion, and accessibility while maintaining professional functionality for aid workers and volunteers.