# Cabin Security Management - Frontend

React dashboard for the Cabin Security & Visitor Management System.

## Run it (first time)

1. Install **Node.js 18 or newer** from https://nodejs.org (this also installs `npm`).
2. Open a terminal in this folder and run:

```bash
npm install     # downloads the libraries (only needed once)
npm run dev     # starts the app
```

3. Open http://localhost:5173
4. Demo login: **amitpatil** / **password123**

Other commands: `npm run build` (production files in `dist/`), `npm run preview` (test the build).

## Demo mode vs real backend

Settings live in the `.env` file:

| Setting | Meaning |
|---|---|
| `VITE_USE_MOCK=true` | Uses built-in sample data. No backend needed. |
| `VITE_USE_MOCK=false` | Talks to your FastAPI backend. |
| `VITE_API_BASE_URL` | Backend address, e.g. `http://localhost:8000/api/v1` |

Restart `npm run dev` after changing `.env`.

## Folder guide

```
src/
  config/        constants.js      routes, roles, departments, page size
  services/      one file per backend area (auth, visitors, entries, access requests)
    client.js      the only place that calls fetch(); adds the login token
    mappers.js     converts backend field names to UI names
    mock/          fake data used in demo mode
  context/       AuthContext (who is logged in), ToastContext (pop-up messages)
  hooks/         useAsync (load data), useDebounce (wait while typing)
  components/
    layout/        Sidebar, Topbar, AppLayout, ProtectedRoute
    ui/            Button, form fields, badges, pagination, loading/empty states
    common/        pieces reused by several pages (fingerprint box, ID lookup...)
  pages/         one folder per screen
  styles/        variables.css (colors), base.css, layout.css, components.css
  utils/         date formatting, form validation
```

## Pages

| Sidebar item | Route | What it does |
|---|---|---|
| Home | `/` | Access requests: select, then Allow (with duration) or Deny |
| Registration | `/registration` | Add visitor, then enroll fingerprint |
| Registered Visitors | `/visitors` | Search, filter, edit or delete |
| Previous Entries | `/previous-entries` | Entry history with filters |
| Edit Registration | `/edit-registration/:id` | Update details, add fingerprint |
| Delete Registration | `/delete-registration/:id` | Review and confirm deletion |
| Logout | | Signs out. Account page is under the top-right user menu. |

## Connecting to the FastAPI backend

The app expects these endpoints (change them in `src/services/*.js` if yours differ):

| Action | Request |
|---|---|
| Log in | `POST /auth/login` `{username, password}` returns `{access_token}` |
| Current user | `GET /auth/me` |
| List visitors | `GET /visitors?search=&department=&role=&page=&pageSize=` returns `{items, total}` |
| One / create / update / delete | `GET`, `POST`, `PUT`, `DELETE /visitors/{id}` |
| Add fingerprint | `POST /visitors/{id}/fingerprints` returns `{fingerprint_id, enrolled_at, status}` |
| Entry history | `GET /entries?search=&department=&role=&result=&page=&pageSize=` returns `{items, total}` |
| Access requests | `GET /access-requests` returns `{items}` |
| Allow / deny | `POST /access-requests/decision` `{ids, decision, duration_minutes}` |

Response fields are expected in `snake_case` (e.g. `visitor_name`, `registered_at`). If yours differ, edit `src/services/mappers.js` only.
Your backend must also allow this app's address in its CORS settings.
