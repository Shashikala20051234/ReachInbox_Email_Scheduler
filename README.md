# ReachInbox Email Scheduler

A full-stack email scheduling and outreach application built as part of the **Outbox Labs SDE Intern Assignment**.

The application allows users to manage email accounts, create campaigns, schedule emails, and monitor email activity through a web interface. The backend uses a queue-based architecture with **Redis and BullMQ** to process scheduled emails reliably.

---

## Overview

ReachInbox Email Scheduler is a full-stack application designed to demonstrate:

* Email account management
* Campaign management
* Email scheduling
* Background job processing
* Queue-based email delivery
* Email activity tracking
* REST API integration
* PostgreSQL database management
* React-based frontend development

The application follows a modular architecture where scheduled email jobs are placed into a Redis-backed queue and processed asynchronously by an email worker.

---

## Features

### Email Account Management

* Add and manage email accounts
* Store SMTP configuration securely through environment variables
* Retrieve configured email accounts through the backend API

### Campaign Management

* Create email campaigns
* Associate campaigns with email accounts
* Retrieve campaign information through REST APIs

### Email Scheduling

* Schedule emails for future delivery
* Store scheduled email information in PostgreSQL
* Process scheduled jobs using BullMQ and Redis
* Track email status such as:

  * `PENDING`
  * `SENT`
  * `FAILED`

### Background Processing

* Redis is used as the queue backend
* BullMQ manages scheduled/background jobs
* Email processing is handled asynchronously
* Worker concurrency can be configured through environment variables

### Activity Monitoring

The frontend provides views for:

* Sent emails
* Scheduled emails
* Email details
* Campaign activity
* Email status tracking

### Frontend

* React with TypeScript
* Vite development environment
* Responsive dashboard-style interface
* REST API integration with the backend

---

## Technology Stack

| Technology   | Purpose                   |
| ------------ | ------------------------- |
| React        | Frontend UI               |
| TypeScript   | Type-safe development     |
| Vite         | Frontend build tool       |
| Node.js      | Backend runtime           |
| Express.js   | REST API server           |
| PostgreSQL   | Relational database       |
| Prisma       | Database ORM              |
| Redis        | Queue and job storage     |
| BullMQ       | Background job processing |
| SMTP         | Email delivery            |
| Git & GitHub | Version control           |

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │   TypeScript + Vite  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │      Node.js         │
                    └───────┬───────┬──────┘
                            │       │
                            │       │
                            ▼       ▼
                    ┌──────────┐  ┌──────────────┐
                    │ Prisma   │  │ BullMQ Queue │
                    └────┬─────┘  └──────┬───────┘
                         │               │
                         ▼               ▼
                  ┌────────────┐   ┌────────────┐
                  │ PostgreSQL │   │   Redis    │
                  └────────────┘   └─────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │ Email Worker│
                                  └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │ SMTP Server │
                                  └──────┬──────┘
                                         │
                                         ▼
                                    Recipient
```

### Email Scheduling Flow

```text
User schedules email
        ↓
Frontend sends API request
        ↓
Express Backend
        ↓
Email stored in PostgreSQL
        ↓
Job added to BullMQ
        ↓
Redis stores scheduled job
        ↓
Worker picks up the job
        ↓
SMTP sends email
        ↓
Email status updated
        ↓
Frontend displays activity/status
```

---

## Project Structure

```text
ReachInbox_Email_Scheduler/
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── workers/
│   │   ├── lib/
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Redis
* Git

Verify Node.js and npm:

```bash
node --version
npm --version
```

Verify Git:

```bash
git --version
```

Make sure PostgreSQL and Redis are running before starting the backend.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Shashikala20051234/ReachInbox_Email_Scheduler.git
```

Move into the project directory:

```bash
cd ReachInbox_Email_Scheduler
```

---

# Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

Use `.env.example` as the reference.

Example:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/reachinbox"

REDIS_HOST="localhost"
REDIS_PORT="6379"

PORT=5000

MAX_EMAILS_PER_HOUR=200
MIN_EMAIL_DELAY_MS=2000
WORKER_CONCURRENCY=5
```

### Important Security Note

Never commit the real `.env` file to GitHub.

The `.env` file may contain:

* Database credentials
* SMTP credentials
* API keys
* Other private configuration

Only `.env.example` should be committed to the repository.

---

## Database Setup

Make sure PostgreSQL is running.

From the `backend` directory, run:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

This creates and updates the required database tables using the Prisma schema.

---

## Redis Setup

Make sure Redis is running before starting the backend and worker.

Verify Redis:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

## Running the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

# Frontend Setup

Open another terminal.

Move to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## API Endpoints

### Health Check

```http
GET /api/health
```

Checks whether the backend server is running.

### Email Accounts

```http
GET /api/email-accounts
```

Returns configured email accounts.

### Campaigns

```http
GET /api/campaigns
```

Returns available campaigns.

### Scheduled Emails

```http
GET /api/scheduled-emails
```

Returns scheduled email records and their statuses.

---

## Email Statuses

The application tracks the lifecycle of scheduled emails.

| Status    | Description                                         |
| --------- | --------------------------------------------------- |
| `PENDING` | Email is waiting to be processed                    |
| `SENT`    | Email was successfully delivered to the SMTP server |
| `FAILED`  | Email processing/delivery failed                    |

---

## Queue-Based Processing

The application uses **BullMQ with Redis** for background email processing.

Instead of keeping the API request waiting while an email is sent:

1. The API receives the scheduling request.
2. The email information is stored in PostgreSQL.
3. A job is added to the BullMQ queue.
4. Redis stores the queued/scheduled job.
5. The worker processes the job.
6. The worker sends the email through SMTP.
7. The email status is updated in PostgreSQL.

This architecture keeps the API responsive and allows email processing to happen independently in the background.

---

## Configuration

The following environment variables control application behaviour:

| Variable              | Description                            |
| --------------------- | -------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string           |
| `REDIS_HOST`          | Redis server hostname                  |
| `REDIS_PORT`          | Redis server port                      |
| `PORT`                | Backend server port                    |
| `MAX_EMAILS_PER_HOUR` | Maximum emails allowed per hour        |
| `MIN_EMAIL_DELAY_MS`  | Minimum delay between email operations |
| `WORKER_CONCURRENCY`  | Number of jobs processed concurrently  |

---

## Development

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Both applications should be running simultaneously.

---

## Testing the Application

After starting the backend and frontend:

1. Open the frontend application.
2. Check the email account section.
3. Verify campaign information.
4. Schedule an email.
5. Check the scheduled email activity.
6. Verify the email status.
7. Check sent/failed email records.
8. Verify that background processing is handled by the queue worker.

---

## Screenshots

Screenshots of the application can be added here.

Example:

```text
Frontend Dashboard
```

```text
Email Scheduling Page
```

```text
Scheduled Emails
```

```text
Email Activity / Details
```

---

## Demo

Demo video:

**[Add Loom or Google Drive demo link here]**

The demonstration covers:

* Application overview
* Email account management
* Campaign management
* Email scheduling
* Queue-based processing
* Email activity
* Backend APIs
* Technical architecture

---

## Hosted Application

**Live Application:**
[Add deployed frontend URL here]

**Backend API:**
[Add deployed backend URL here]

---

## Future Improvements

Possible future improvements include:

* OAuth-based email account authentication
* Rich email composer
* Email templates
* CSV contact import
* Campaign analytics
* Open and click tracking
* Retry mechanism with exponential backoff
* Advanced rate limiting
* Improved authentication and authorization
* Production-grade monitoring and logging
* Docker-based deployment
* Automated testing and CI/CD

---

## Security

Sensitive configuration is stored using environment variables.

The repository does not contain production credentials or private `.env` files.

The `.gitignore` file prevents environment files and generated dependencies from being committed.

---

## Author

**Shashikala C Bhosale**

GitHub:
https://github.com/Shashikala20051234

---

## Assignment

This project was developed as part of the **Outbox Labs SDE Intern Assignment**.

The implementation demonstrates full-stack development, REST APIs, database integration, asynchronous job processing, Redis/BullMQ queues, and email scheduling.
