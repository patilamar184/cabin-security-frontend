# SmartCabin Frontend

React + Vite frontend for the Cabin Security Management FastAPI backend.

## Requirements
- Node.js 18 or newer
- Cabin Security backend running at `http://localhost:8000`

## Run locally
1. Keep the backend running with Docker Compose.
2. In this folder, run `npm install`.
3. Keep `VITE_API_URL=` empty in `.env` for local development.
4. Run `npm run dev`.
5. Open `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://127.0.0.1:8000`.
The backend CORS setting should include `http://localhost:5173` if you choose to set
`VITE_API_URL=http://localhost:8000` and call the backend directly.

## Backend contract notes
- Owner registration: `POST /api/auth/register` with `full_name`, `email`, `password`,
  `phone`, `cabin_name`, and `cabin_location`.
- Owner login: `POST /api/auth/login`.
- Admin login: `POST /api/admin/login`.
- Visitors use role IDs from `GET /api/visitor-roles`; the frontend resolves role names.
- Visitor deletion is not implemented by the backend. The UI deactivates visitors with
  `PATCH /api/visitors/{id}` and `is_active: false`.
- Fingerprint enrollment requires a registered device, visitor ID, and sensor template ID.
- Device registration uses `POST /api/devices` with `{ "name": "..." }`.
- Admin owner deletion is not implemented; the UI supports block/unblock only.

## Build
Run `npm run build`.
