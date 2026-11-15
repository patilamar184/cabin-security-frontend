# SmartCabin Frontend

React + Vite frontend for the **Cabin Security Management System**, integrated with the FastAPI backend.

The application provides separate interfaces for Cabin Owners and Platform Administrators to manage visitors, access requests, fingerprints, devices and cabin security operations.

## Technology Stack

- React
- Vite
- JavaScript
- Nginx
- Docker

## Architecture

The frontend communicates with the FastAPI backend through an Nginx reverse proxy in Docker production mode.

```text
Browser
   |
   v
React + Nginx
   |
   | /api/*
   v
FastAPI Backend
   |
   v
PostgreSQL Database
```

## Requirements

### For local development
- Node.js 18 or newer
- npm
- Cabin Security backend running at `http://localhost:8000`

### For Docker deployment
- Docker Desktop
- Docker Engine with Docker CLI

## Project Structure

```text
cabin-security-frontend/
│
├── src/
├── public/
├── node_modules/
│
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── .env
├── .env.example
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Environment Configuration

Create a `.env` file in the frontend root directory.

For local development:

```env
VITE_API_URL=
```

Keep `VITE_API_URL` empty when using the Vite development proxy.

For local production builds using the Nginx proxy, the frontend also uses relative `/api` requests.

**Important:** Vite environment variables are embedded into the frontend during the build. Do not put passwords, private API keys or other secrets in frontend environment variables.

## Run Locally

1. Start the backend using Docker Compose.
2. Open the frontend project directory.
3. Install dependencies:

```bash
npm install
```

4. Start the Vite development server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to:

```text
http://127.0.0.1:8000
```

## Docker Deployment

The frontend uses a multi-stage Docker build:

- Node.js builds the React application.
- Nginx serves the production build.
- Nginx forwards API requests to the backend.

### Build Docker Image

```bash
docker build -t cabin-security-frontend .
```

### Run Docker Container

```bash
docker run -d -p 5173:80 --name cabin-frontend cabin-security-frontend
```

### Access Application

```text
http://localhost:5173
```

### Check Container Status

```bash
docker ps
```

### View Container Logs

```bash
docker logs cabin-frontend
```

### Stop Container

```bash
docker stop cabin-frontend
```

### Remove Container

```bash
docker rm cabin-frontend
```

### Rebuild After Configuration Changes

If you modify `Dockerfile`, `nginx.conf` or frontend source code:

```bash
docker rm -f cabin-frontend

docker build --no-cache -t cabin-security-frontend .

docker run -d -p 5173:80 --name cabin-frontend cabin-security-frontend
```

## Nginx Configuration

The production Nginx server:

- Serves React static files.
- Supports React client-side routing.
- Proxies `/api/` requests to the FastAPI backend.

The configured backend proxy is:

```nginx
location /api/ {
    proxy_pass http://host.docker.internal:8000/api/;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

`host.docker.internal` allows the frontend container to access the backend through the Docker host.

**Important:** The backend must be running and its API port 8000 must be published on the Docker host.

This configuration is intended for Docker Desktop development on Windows and macOS. For Linux deployments, configure an appropriate shared Docker network or host gateway.

## Backend Integration

Backend API base path:

```text
/api
```

Important API operations:

| Operation | Endpoint |
|---|---|
| Owner Registration | `POST /api/auth/register` |
| Owner Login | `POST /api/auth/login` |
| Admin Login | `POST /api/admin/login` |
| Visitor Roles | `GET /api/visitor-roles` |
| Device Registration | `POST /api/devices` |
| Visitor Deactivation | `PATCH /api/visitors/{id}` |

### Implementation Notes

- Owner registration creates an active account immediately.
- Visitors use role IDs obtained from the visitor roles endpoint.
- Visitor deletion is implemented as deactivation using `is_active: false`.
- Fingerprint enrollment requires a registered device, visitor ID and sensor template ID.
- Device registration uses `POST /api/devices` with `{ "name": "..." }`.
- Platform administrator owner deletion is not supported; the interface supports blocking and unblocking owners.

## Production Build

To create a production build without Docker:

```bash
npm run build
```

The output is generated in:

```text
dist/
```

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### 502 Bad Gateway

Check whether the backend is running and accessible on host port 8000.

```bash
docker ps
```

Check frontend Nginx logs:

```bash
docker logs cabin-frontend
```

### Connection Refused

Verify that the backend is running:

```text
http://localhost:8000/docs
```

### Nginx Upstream Host Not Found

Verify that the Nginx configuration uses the correct backend address:

```text
http://host.docker.internal:8000
```

Rebuild the frontend image after modifying `nginx.conf`.

### Frontend Changes Not Visible

Rebuild the image and hard-refresh the browser using `Ctrl + Shift + R`.

## Related Repository

- Backend: Cabin Security Management Backend
