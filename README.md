# InvoicerPro

A full-stack invoice management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Create, edit, and manage professional invoices
- Client management
- PDF generation and email delivery
- Dashboard with revenue analytics
- Google OAuth + JWT authentication
- Password reset via email
- Multi-currency support

## Tech Stack

**Frontend:** React 17, Redux, MUI v5, React Router v5, Recharts, ApexCharts  
**Backend:** Node.js, Express, MongoDB (Mongoose 7), JWT, Puppeteer (PDF), Nodemailer

## Security

- All API routes protected with JWT auth middleware
- Input validation on all endpoints
- Passwords hashed with bcrypt (12 rounds)
- Token expiry enforced client and server side

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB instance (local or Atlas)
- SMTP credentials for email

### Server Setup

```bash
cd server
npm install
```

Create `server/.env`:
```
DB_URL=your_mongodb_connection_string
SECRET=your_jwt_secret_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
PORT=5000
```

```bash
npm start
```

### Client Setup

```bash
cd client
npm install
```

Create `client/.env`:
```
REACT_APP_API=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_URL` | MongoDB connection string |
| `SECRET` | JWT signing secret |
| `SMTP_HOST` | Email server host |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |
| `PORT` | Server port (default 5000) |
