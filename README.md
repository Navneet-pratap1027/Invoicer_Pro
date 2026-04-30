<div align="center">

<img src="https://i.postimg.cc/hGZKzdkS/logo.png" alt="InvoicerPro Logo" width="80" />

# InvoicerPro

**Professional invoice management for freelancers and small businesses.**

[![React](https://img.shields.io/badge/React-17-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_7-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Environment Variables](#environment-variables) · [Security](#security)

</div>

---

## Overview

InvoicerPro is a full-stack MERN application that lets you create, send, and track professional invoices — with PDF generation, email delivery, client management, and a live revenue dashboard, all in one place.

---

## Features

- **Invoice Management** — Create, edit, duplicate, and delete invoices with line items, discounts, VAT, and multi-currency support
- **PDF Generation** — Generate pixel-perfect PDF invoices via Puppeteer and download or email them instantly
- **Email Delivery** — Send invoices directly to clients with a professional email template via Nodemailer
- **Client Management** — Maintain a client directory with contact details linked to invoices
- **Revenue Dashboard** — Visualise paid, unpaid, and overdue amounts with charts (Recharts + ApexCharts)
- **Payment Tracking** — Record partial and full payments against any invoice
- **Authentication** — Google OAuth 2.0 and email/password login with JWT session management
- **Password Reset** — Secure token-based password reset delivered by email

---

## Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| React 17 | UI framework |
| Redux | Global state management |
| React Router v5 | Client-side routing |
| Material UI v5 | Component library |
| Recharts + ApexCharts | Dashboard data visualisation |
| Axios | HTTP client |
| file-saver | PDF download |

### Backend
| Library | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose 7 | Database and ODM |
| Puppeteer | Headless PDF generation |
| Nodemailer | Transactional email |
| JSON Web Tokens | Stateless authentication |
| bcrypt | Password hashing |

---

## Getting Started

### Prerequisites

- Node.js 16 or higher
- MongoDB instance (local or [MongoDB Atlas](https://cloud.mongodb.com))
- SMTP credentials (Gmail, SendGrid, Mailgun, etc.)
- Google OAuth Client ID (optional — for Google login)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/invoicerpro.git
cd invoicerpro
```

---

### 2. Server setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
DB_URL=your_mongodb_connection_string
SECRET=your_jwt_secret_key

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password

PORT=5000
```

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

### 3. Client setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
REACT_APP_API=http://localhost:5000
REACT_APP_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the client:

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | ✅ | MongoDB connection string |
| `SECRET` | ✅ | JWT signing secret (use a long random string) |
| `SMTP_HOST` | ✅ | SMTP server hostname |
| `SMTP_PORT` | ✅ | SMTP port — usually `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | ✅ | SMTP login email address |
| `SMTP_PASS` | ✅ | SMTP password or app-specific password |
| `PORT` | ➖ | Server port — defaults to `5000` |

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API` | ✅ | Base URL of the backend API |
| `REACT_APP_URL` | ✅ | Base URL of the frontend (used in email links) |
| `REACT_APP_GOOGLE_CLIENT_ID` | ➖ | Google OAuth Client ID for Google login |

---

## Security

- All API routes are protected with JWT auth middleware
- Passwords are hashed with **bcrypt** (12 salt rounds)
- JWT tokens have enforced expiry, validated on both client and server
- Input validation applied on all API endpoints
- CORS configured on the Express server
- Environment secrets are never committed — always use `.env` files

---

## Project Structure

```
invoicerpro/
├── client/                  # React frontend
│   ├── src/
│   │   ├── actions/         # Redux action creators
│   │   ├── components/      # UI components
│   │   │   ├── Dashboard/
│   │   │   ├── Invoice/
│   │   │   ├── InvoiceDetails/
│   │   │   ├── Invoices/
│   │   │   ├── Clients/
│   │   │   ├── NavBar/
│   │   │   └── Settings/
│   │   ├── reducers/        # Redux reducers
│   │   └── utils/           # Shared utilities
│   └── .env
│
└── server/                  # Node.js + Express backend
    ├── documents/           # PDF & email HTML templates
    ├── models/              # Mongoose schemas
    ├── routes/              # API route handlers
    ├── middleware/          # Auth middleware
    ├── index.js             # Server entry point
    └── .env
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) © InvoicerPro
