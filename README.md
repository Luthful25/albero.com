# Albero Studio Website

Deployable static frontend with a Node.js/Express backend and MySQL database.

## Local Run

```bash
npm install
npm run build
npm start
```

Open `http://localhost:5000`.

## Database

Create the MySQL tables and starter content:

```bash
mysql -u root -p < backend/database/schema.sql
```

Then copy `backend/.env.example` to `backend/.env` and update the database and admin values.

On PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

For this local Windows workspace, a portable MariaDB database can be started with:

```powershell
npm run db:start
```

## Deploy

Use these deploy settings:

- Build command: `npm run build`
- Start command: `npm start`
- Node version: `20` or newer
- Required environment file values: see `backend/.env.production.example`

The Express server serves both the frontend pages and `/api/*` routes from one domain.

## Roadmap Implementation

The current build includes the foundations for all ten roadmap phases:

1. Shared responsive header/footer, mobile navigation, cleaned legacy layout rules, and responsive quotation/client pages.
2. HttpOnly cookie authentication, scrypt password hashes, rate limiting, validation, CORS credentials, and production environment checks.
3. Lead scoring, CRM pipeline, notes, priorities, follow-ups, quotations, orders, and client records in the admin panel.
4. Slug-based blog and case-study detail pages with safe dynamic content rendering.
5. Bangladesh locale controls, Bangla core navigation labels, BDT formatting, and Bangladesh-aware contact/quote flows.
6. A local Albero assistant with a safe API boundary and an upgrade path for an approved AI provider.
7. Quotation submission and order/payment-intent data models.
8. Manual payment intents plus guarded bKash/Nagad integration points; live provider callbacks require merchant credentials and verified URLs.
9. Client login/session and order portal foundations.
10. First-party page/interaction analytics and an admin analytics summary endpoint.

After pulling these schema changes into an existing installation, rerun `backend/database/schema.sql` or apply an equivalent migration before using CRM, quotes, orders, clients, or analytics.

The local assistant and payment endpoints are deliberately safe foundations, not claims of a live AI provider or live bKash/Nagad settlement. Production activation requires the relevant provider credentials, callback URLs, and a final security review.
