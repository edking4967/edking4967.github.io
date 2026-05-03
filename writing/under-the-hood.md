---
layout: default
title: How Quill Works Under the Hood | Edward King
---

<section class="writeup-section" markdown="1">

# How Quill Works Under the Hood

Quill is a straightforward full-stack web app: a Flask backend with a SQLite database, and a React frontend built with Vite. This post walks through every layer — database schema, API design, frontend state, and the few design decisions worth explaining.

---

## The database

Quill uses SQLite with three tables.

```sql
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,       -- Werkzeug hash, auto-salted
    created_at  TEXT DEFAULT (date('now'))
);

CREATE TABLE projects (
    id           TEXT PRIMARY KEY,   -- client-generated timestamp ID
    user_id      INTEGER NOT NULL,
    title        TEXT NOT NULL,
    target_words INTEGER DEFAULT 80000,
    deadline     TEXT,               -- ISO date string or NULL
    created_at   TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE sessions (
    id           TEXT PRIMARY KEY,   -- client-generated timestamp ID
    user_id      INTEGER NOT NULL,
    project_id   TEXT NOT NULL,
    date         TEXT NOT NULL,      -- ISO date string
    duration     INTEGER DEFAULT 0,  -- minutes
    words_delta  INTEGER DEFAULT 0,  -- net words added this session
    activity     TEXT DEFAULT 'writing',
    notes        TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

A few things worth noting:

**Client-generated IDs.** Projects and sessions use `Date.now().toString()` as their primary key, assigned on the frontend before the POST request. This avoids a round-trip to get a server-generated ID and simplifies optimistic UI updates. It's safe at this scale — single-user accounts with no concurrent writes.

**`words_delta` not a running total.** Each session records how many words were *added* in that session, not the cumulative count. The totals you see in the UI are computed by summing `words_delta` across sessions in JavaScript. This lets you log negative deltas (e.g., a heavy editing session that cut 500 words) without corrupting historical data.

**SQLite is sufficient.** Quill is a single-user personal tool. SQLite handles it without issue and removes all infrastructure overhead — no database server, no connection pooling, just a file.

---

## The Flask backend

All server logic lives in `backend/app.py`. Flask handles both the API and static file serving.

### Auth

Authentication uses Flask's signed session cookie (backed by `SECRET_KEY`). On login or register, the user's ID and email are stored in `session`. Every protected route checks for `session["user_id"]` via a `@login_required` decorator.

```python
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Not authenticated"}), 401
        return f(*args, **kwargs)
    return decorated
```

Passwords are hashed with `werkzeug.security.generate_password_hash`, which uses PBKDF2-HMAC-SHA256 with a random salt. No passwords are stored in plaintext.

### API routes

```
POST /api/register       — create account, set session
POST /api/login          — verify password, set session
POST /api/logout         — clear session
GET  /api/me             — return current user or null
GET  /api/projects       — list projects for current user
POST /api/projects       — create a project
GET  /api/sessions       — list sessions for current user
POST /api/sessions       — log a session
```

All data is scoped to `session["user_id"]` — users can only see their own records.

### Serving the React app

In production, Flask serves the Vite build as static files:

```python
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path and os.path.exists(os.path.join(BASE_DIR, "dist", path)):
        return send_from_directory(os.path.join(BASE_DIR, "dist"), path)
    return send_from_directory(os.path.join(BASE_DIR, "dist"), "index.html")
```

Every route that doesn't match a real file returns `index.html`, which is the correct behavior for a single-page app. Because Flask is serving both the API and the frontend, all API calls use the relative path `/api` — no CORS issues, no environment variables needed for the API URL.

---

## The React frontend

The frontend is a single-page app with no client-side router. Tab switching is managed by a `tab` state string in `App.jsx`. The component tree is flat: `App` holds all state and passes it down as props.

### State

Everything lives in `App.jsx`:

- `user` — the logged-in user object (or `null`)
- `projects` — array of project objects
- `sessions` — array of all sessions for the current user
- `activeProject` — the ID of the project currently shown on the dashboard
- `tab` — which tab is active: `"dashboard"`, `"log"`, `"projects"`, or `"history"`

On mount, Quill calls `GET /api/me` to check for an existing session. If a user is found, it immediately fires two parallel requests — `GET /api/projects` and `GET /api/sessions` — and populates state. There's no client-side cache invalidation to manage because the frontend always holds the full dataset in memory.

### Stats computation

All the numbers displayed — total words, week words, completion percentage, streak — are computed inline in the render function from the raw `sessions` array. There's no derived state, no memoization. For the dataset sizes involved (hundreds of sessions at most), this is fine and keeps the code simple.

The streak calculation is a good example of the pattern:

```js
let streak = 0;
const writingDays = new Set(
    sessions.filter(s => s.words_delta > 0).map(s => s.date)
);
let checkD = new Date();
while (writingDays.has(checkD.toISOString().slice(0, 10))) {
    streak++;
    checkD.setDate(checkD.getDate() - 1);
}
```

Walk backwards from today, count consecutive days that appear in the set of days with positive word counts.

### The heatmap

`Heatmap.jsx` generates a 16-week (112-day) grid. It builds an array of ISO date strings, then groups them into weeks of 7 to produce the columns. Each cell's opacity is scaled relative to the maximum single-day word count in the dataset:

```js
const opacity = count ? 0.2 + 0.8 * (count / max) : 0;
```

The minimum opacity for any non-zero day is 0.2 so that even a tiny session is visibly different from a missed day.

### The timer

`Timer.jsx` is a stopwatch implemented with `setInterval`. It ticks every 10ms for smooth display but reports elapsed time in whole minutes to the parent via an `onTimeChange` callback. The parent (`SessionForm`) stores the minutes value in the form state. When the user ends the session, the form submits with `duration` pre-filled.

### Demo mode

`?demo` in the URL sets `isDemo = true` at the top of `App.jsx`. In demo mode:
- Auth checks are skipped entirely
- All API calls are replaced with mutations to local state
- Data comes from `demoData.js` (hardcoded fake projects and sessions)

Demo mode sessions log to local React state only — nothing is ever sent to the server.

### API wrapper

`api.js` is a thin wrapper around `fetch` that adds `credentials: "include"` (needed for session cookies) and sets `Content-Type: application/json` on POST requests. It returns parsed JSON directly.

---

## Design decisions

**No Redux, no React Query.** The data model is simple enough that plain `useState` works. Adding a caching layer would introduce complexity with no benefit.

**No client-side routing.** Tab state is a string. React Router would add a dependency and a mental model for what is genuinely just four views.

**`backend/dist/` is committed.** PythonAnywhere's free tier has no Node.js, so the built frontend can't be generated on the server. Committing the build means deployment is a `git pull` — no build step, no CI required.

**Relative API path.** `const API = "/api"` works in both development (Vite proxies `/api` to `localhost:5000`) and production (Flask serves everything from the same origin). No environment-specific configuration needed.

</section>
