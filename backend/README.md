# NexMeet Backend API

**NexMeet — Discover. Connect. Grow.**

A fully-featured Node.js/Express/PostgreSQL/Prisma backend for the NexMeet event-centered networking platform.

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or use the embedded PostgreSQL via start.sh)

### Option 1: Using the startup script (recommended for development)

```bash
cd backend
./start.sh
```

This automatically:
1. Installs and starts embedded PostgreSQL (no system PostgreSQL needed)
2. Creates the database and user
3. Runs Prisma migrations
4. Seeds test data
5. Starts the backend server on port 5000

### Option 2: Manual setup with system PostgreSQL

```bash
# 1. Create database
createdb nexmeet
createuser nexmeet_user
psql -c "ALTER USER nexmeet_user WITH PASSWORD 'nexmeet_pass_2024'"
psql -c "GRANT ALL PRIVILEGES ON DATABASE nexmeet TO nexmeet_user"

# 2. Install dependencies
cd backend
npm install

# 3. Set up .env (copy from .env.example)
cp .env.example .env
# Edit DATABASE_URL in .env

# 4. Run migrations
npx prisma migrate dev

# 5. Seed database
node prisma/seed.js

# 6. Start server
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://nexmeet_user:nexmeet_pass_2024@localhost:5432/nexmeet"
JWT_SECRET="your-secret-here"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

---

## API Endpoints

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET  | /api/auth/me | Get current user |

### Users & Profiles
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/users/me | Get my profile |
| PATCH | /api/users/me | Update my profile |
| PATCH | /api/users/me/privacy | Update privacy settings |
| GET  | /api/users/:id | Get user by ID |
| GET  | /api/users/me/saved-events | My saved events |
| GET  | /api/users/me/registered-events | My registered events |

### Events
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/events | List/search events (with filters) |
| GET  | /api/events/:id | Get event details |
| POST | /api/events | Create event (organizer) |
| PATCH | /api/events/:id | Update event |
| DELETE | /api/events/:id | Archive event |
| POST | /api/events/:id/publish | Publish event |
| POST | /api/events/:id/register | Register for event |
| DELETE | /api/events/:id/register | Cancel registration |
| GET  | /api/events/:id/registration | Get registration status |
| POST | /api/events/:id/save | Save event |
| DELETE | /api/events/:id/save | Unsave event |
| GET  | /api/events/saved | Get saved events |
| GET  | /api/events/registered | Get registered events |
| GET  | /api/events/:id/attendees | Get attendees (privacy-aware) |
| GET  | /api/events/:id/reviews | Get reviews |
| POST | /api/events/:id/reviews | Create review |

### Connections & Networking
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/connections | Get my connections |
| GET  | /api/connections/requests | Get pending requests |
| GET  | /api/connections/recommendations | Get people recommendations |
| GET  | /api/connections/status/:userId | Get connection status |
| POST | /api/connections/:userId | Send connection request |
| PATCH | /api/connections/:id/accept | Accept request |
| PATCH | /api/connections/:id/reject | Reject request |
| DELETE | /api/connections/:id | Remove connection |

### Communities
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/communities | Get all communities |
| GET  | /api/events/:eventId/community | Get event community |
| GET  | /api/events/:eventId/community/posts | Get community posts |
| POST | /api/events/:eventId/community/posts | Create post |
| PATCH | /api/posts/:id | Update post |
| DELETE | /api/posts/:id | Delete post |
| POST | /api/posts/:id/comments | Add comment |
| DELETE | /api/comments/:id | Delete comment |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/notifications | Get notifications |
| GET  | /api/notifications/unread-count | Get unread count |
| PATCH | /api/notifications/:id/read | Mark as read |
| PATCH | /api/notifications/read-all | Mark all as read |

### Organizers
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/organizers | Create organizer profile |
| GET  | /api/organizers/me | Get my organizer profile |
| GET  | /api/organizers/me/events | My events |
| GET  | /api/organizers/me/analytics | Analytics dashboard |
| GET  | /api/organizers/:id | Get organizer by ID |
| PATCH | /api/organizers/:id | Update organizer |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/admin/stats | Platform statistics |
| GET  | /api/admin/users | List users |
| PATCH | /api/admin/users/:id | Update user |
| GET  | /api/admin/events | List all events |
| GET  | /api/admin/organizers | List organizers |
| PATCH | /api/admin/organizers/:id/verify | Verify organizer |
| GET  | /api/admin/reports | Get reports |
| PATCH | /api/admin/reports/:id | Resolve report |

---

## Event Query Parameters

```
GET /api/events?search=AI&category=workshop&city=Hyderabad&online=false&price=free&experienceLevel=beginner&networkingAvailable=true&page=1&limit=20&sort=startDate
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| search | string | Full-text search |
| category | workshop, conference, meetup, etc. | Filter by category |
| city | string | Filter by city |
| online | true/false | Online/in-person |
| price | free/paid | Price filter |
| experienceLevel | beginner/intermediate/advanced/all | Level filter |
| networkingAvailable | true/false | Has networking |
| certificateAvailable | true/false | Has certificate |
| sort | startDate/newest/oldest/price_asc/price_desc/popular | Sort order |
| page | number | Page number (default: 1) |
| limit | number | Results per page (max: 100, default: 20) |

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexmeet.com | password123 |
| User | arjun.reddy@techcorp.com | password123 |
| Organizer | organizer@techevents.com | password123 |
| User | priya.sharma@university.edu | password123 |

---

## Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── prisma.js          # Prisma client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usersController.js
│   │   ├── eventsController.js
│   │   ├── networkingController.js
│   │   ├── communityController.js
│   │   ├── notificationsController.js
│   │   ├── organizerController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── validate.js        # Zod validation
│   │   └── errorHandler.js    # Error handling
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── events.js
│   │   ├── networking.js
│   │   ├── notifications.js
│   │   ├── organizers.js
│   │   ├── admin.js
│   │   └── options.js
│   ├── utils/
│   │   └── logger.js          # Winston logger
│   ├── app.js                 # Express app
│   └── server.js              # Server entry point
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Test data seeder
│   └── migrations/            # Migration history
├── start.sh                   # Easy startup script
├── .env                       # Environment variables
└── package.json
```

---

## Key Features

- **Authentication**: JWT with bcrypt password hashing
- **Authorization**: Role-based (USER, ORGANIZER, ADMIN)
- **Event Lifecycle**: DRAFT → PUBLISHED → UPCOMING/ONGOING/COMPLETED/CANCELLED
- **Event Search**: Full-text search with filters, sorting, and pagination
- **Privacy System**: Backend-enforced profile and attendance privacy
- **Connections**: Full connection request/accept/reject flow
- **Recommendations**: Deterministic matching based on skills, interests, events
- **Communities**: Event-centered community posts and comments
- **Notifications**: Auto-generated for registrations, connections, event changes
- **Capacity**: Transaction-safe concurrent registration handling
- **External Events**: Architecture ready for authorized event source ingestion
