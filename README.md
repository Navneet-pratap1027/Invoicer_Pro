<div align="center">

<img src="./client/public/icons/favicon.ico.png" alt="InvoicerPro Logo" width="100" />

# InvoicerPro

**Professional invoice management powered by AI — built for freelancers and small businesses.**

[![React](https://img.shields.io/badge/React-17-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_7-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#features) · [Tech Stack](#tech-stack) · [AI Features](#ai-features) · [Getting Started](#getting-started) · [Environment Variables](#environment-variables) · [Docker](#docker) · [Security](#security)

</div>

---

## Overview

InvoicerPro is a full-stack MERN application that lets you create, send, and track professional invoices — with PDF generation, email delivery, client management, a live revenue dashboard, and an AI assistant powered by Google Gemini, all in one place.

---

## Features

- **Invoice Management** — Create, edit, and delete invoices with line items, discounts, VAT, and multi-currency support
- **PDF Generation** — Generate pixel-perfect PDF invoices via Puppeteer and download or email them instantly
- **Email Delivery** — Send invoices directly to clients with a professional email template via Nodemailer
- **Client Management** — Maintain a client directory with contact details linked to invoices
- **Revenue Dashboard** — Visualise paid, unpaid, and overdue amounts with charts (Recharts + ApexCharts)
- **Payment Tracking** — Record partial and full payments against any invoice
- **Authentication** — Google OAuth 2.0 and email/password login with JWT session management
- **Password Reset** — Secure token-based password reset delivered by email
- **AI Assistant** — Google Gemini powered chat, payment reminders, and expense categorization
- **Docker Support** — Fully containerized with Docker Compose for local dev and production

---

## AI Features

InvoicerPro includes a dedicated **AI Assistant** section powered by **Google Gemini**:

### 💬 AI Chat Assistant
Ask anything about your invoices — overdue counts, revenue summaries, business tips. The AI has full context of your invoice data.

### 🔔 Smart Payment Reminders
Select any unpaid invoice and AI generates a professional reminder email instantly — with tone adjusted based on how many days overdue (friendly → urgent → firm).

### 🏷️ Auto Expense Categorizer
Select any invoice and AI automatically categorizes all line items into standard business expense categories (Software & Tools, Professional Services, Marketing, etc.) with confidence scores.

---

## Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| React 17 | UI framework |
| Redux | Global state management |
| React Router v5 | Client-side routing |
| Material UI v4 | Component library |
| Recharts + ApexCharts | Dashboard data visualisation |
| Axios | HTTP client |
| file-saver | PDF download |


### Backend
| Library | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose 7 | Database  |
| Puppeteer | Headless PDF generation |
| Nodemailer | Transactional email |
| JSON Web Tokens | Stateless authentication |
| bcrypt | Password hashing |
| Google Gemini API | AI features |
| node-fetch | Gemini API calls |

### DevOps
| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Containerization |
| GitHub Actions | CI/CD pipeline |
| Nginx | Frontend reverse proxy |
| Render | Cloud deployment |

---

## Getting Started

### Prerequisites

- Node.js 16 or higher
- MongoDB instance (local or [MongoDB Atlas](https://cloud.mongodb.com))
- SMTP credentials (Gmail, SendGrid, Mailgun, etc.)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))
- Google OAuth Client ID (optional — for Google login)

---

### 1. Clone the repository

```bash
git clone https://github.com/Navneet-pratap1027/Invoicer_Pro.git
cd Invoicer_Pro
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

GEMINI_API_KEY=your_gemini_api_key

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

## Docker

Run the entire stack locally with one command:

```bash
docker-compose up --build
```

This starts MongoDB, the Node.js server, and the React client together.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | ✅ | MongoDB connection string |
| `SECRET` | ✅ | JWT signing secret |
| `SMTP_HOST` | ✅ | SMTP server hostname |
| `SMTP_PORT` | ✅ | SMTP port — usually `587` |
| `SMTP_USER` | ✅ | SMTP login email |
| `SMTP_PASS` | ✅ | SMTP password |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI features |
| `PORT` | ➖ | Server port — defaults to `5000` |

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API` | ✅ | Base URL of the backend API |
| `REACT_APP_URL` | ✅ | Base URL of the frontend |
| `REACT_APP_GOOGLE_CLIENT_ID` | ➖ | Google OAuth Client ID |

---

## Security

- All API routes protected with JWT auth middleware
- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens have enforced expiry, validated on both client and server
- Input validation on all API endpoints
- CORS configured on the Express server
- Environment secrets never committed — always use `.env` files

---

## Project Structure

```
Invoicer_Pro/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD pipeline
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── actions/          # Redux action creators
│   │   ├── components/
│   │   │   ├── AI/           # AI Assistant (Chat, Reminders, Categorizer)
│   │   │   ├── Dashboard/
│   │   │   ├── Invoice/
│   │   │   ├── InvoiceDetails/
│   │   │   ├── Invoices/
│   │   │   ├── Clients/
│   │   │   ├── NavBar/
│   │   │   └── Settings/
│   │   ├── reducers/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env
│
├── server/                   # Node.js + Express backend
│   ├── controllers/
│   │   └── ai.js             # Gemini AI controller
│   ├── documents/            # PDF & email HTML templates
│   ├── models/               # Mongoose schemas
│   ├── routes/
│   │   └── ai.js             # AI API routes
│   ├── middleware/
│   ├── Dockerfile
│   ├── index.js
│   └── .env
│
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) © 2026 Navneet Pratap
