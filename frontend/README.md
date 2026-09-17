# NexMeet Frontend

A modern React application for event discovery and professional networking.

**Tagline:** Discover. Connect. Grow.

## Features

- 🔍 **Event Discovery** - Find workshops, conferences, meetups, and more
- 👥 **Professional Networking** - Connect with like-minded professionals
- 🎯 **Personalized Recommendations** - Get event suggestions based on your interests
- 📍 **Location Flexibility** - Online, offline, and hybrid events
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🏆 **Certificate Information** - View certificate opportunities for events (supporting feature)

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nexmeet.git
   cd nexmeet/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── context/            # React Context providers
├── services/           # API service functions
├── utils/              # Utility functions
├── constants/          # App constants
└── styles/             # Global styles
```

## Development

This is a complete MVP frontend implementation including:

- ✅ User Authentication (Login/Register)
- ✅ Event Discovery & Listing with Search/Filters
- ✅ Event Details & Registration
- ✅ User Dashboard
- ✅ Profile Management
- ✅ Saved Events
- ✅ Registered Events
- ✅ Communities (placeholder)
- ✅ Certificate Information (supporting feature)
- ✅ Responsive Design
- ✅ Modern UI Components

### Certificate Information Feature

The certificate feature is implemented as a **small supporting feature** that:
- Shows certificate availability indicators on event cards
- Displays detailed certificate information on event details pages
- Maintains focus on networking as the primary platform purpose
- Includes certificate info in user's past events
- Uses amber/orange theming to distinguish from main features

See `CERTIFICATE_FEATURE_DEMO.md` for detailed information about the certificate implementation.

## Next Steps

To complete the full application:

1. **Backend API** - Implement Node.js/Express server with PostgreSQL
2. **Authentication** - JWT-based auth system
3. **Database** - Set up PostgreSQL with proper schema
4. **Testing** - Add comprehensive test suite
5. **Deployment** - Deploy to production environment

## License

MIT License