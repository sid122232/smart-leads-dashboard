# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack.

## Tech Stack
- **Frontend:** React.js, TypeScript, TailwindCSS, Zustand, React Query
- **Backend:** Node.js, Express.js, TypeScript, MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Infra:** Docker, Nginx

## Features
- JWT Authentication with role-based access (Admin / Sales)
- Lead management — create, update, delete, view
- Advanced filtering — status, source, search, sort (combined)
- Backend pagination (10 per page)
- Debounced search
- CSV export
- Dark mode

## Quick Start (Docker)

```bash
git clone <your-repo-url>
cd smart-leads-dashboard

# Copy env files
cp backend/.env.example backend/.env
# Fill in MONGODB_URI and JWT_SECRET in backend/.env

docker-compose up --build
```

Frontend → http://localhost:5173  
Backend → http://localhost:5000

## Manual Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### backend/.env
| Variable | Description |
|---|---|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT signing |
| JWT_EXPIRES_IN | Token expiry (default: 7d) |
| CLIENT_URL | Frontend URL for CORS |

### frontend/.env
| Variable | Description |
|---|---|
| VITE_API_URL | Backend API URL |

## API Documentation

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |

### Leads
| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| GET | /api/leads | List leads with filters | Yes | All |
| GET | /api/leads/export | Export leads as CSV | Yes | All |
| GET | /api/leads/:id | Get single lead | Yes | All |
| POST | /api/leads | Create lead | Yes | All |
| PATCH | /api/leads/:id | Update lead | Yes | All |
| DELETE | /api/leads/:id | Delete lead | Yes | Admin only |

### Query Parameters for GET /api/leads
| Param | Type | Description |
|---|---|---|
| page | number | Page number (default: 1) |
| limit | number | Records per page (default: 10) |
| status | string | New, Contacted, Qualified, Lost |
| source | string | Website, Instagram, Referral |
| search | string | Search by name or email |
| sort | string | latest or oldest |

## Role Permissions
| Feature | Admin | Sales |
|---|---|---|
| View all leads | Yes | No (own only) |
| Create lead | Yes | Yes |
| Edit lead | Yes | YES (own only) |
| Delete lead | Yes | NO |
| Export CSV | YES | YES |