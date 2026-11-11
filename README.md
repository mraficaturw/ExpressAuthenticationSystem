# 🔐 Login Authentication System

A full-stack JWT-based authentication system. Built for **OIBSIP Web Development Level 2**.

**Stack:** Node.js · Express · SQLite · Sequelize · bcryptjs · JWT · Vanilla JS

---

## ⚡ Quick Start

### Requirements
- [Node.js](https://nodejs.org/) v18+

### Steps

```bash
# 1. Clone & enter directory
git clone <your-repo-url>
cd WebDev-L2-LoginAuthenticationSystem

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Then open .env and set your JWT_SECRET
```

**`.env` contents:**
```env
JWT_SECRET="your_secret_key_here"
JWT_EXPIRES_IN="1h"
```

```bash
# 4. Start the backend
npm start          # production
npm run dev        # development (auto-restart with nodemon)
```

> Backend runs at **http://localhost:3000**

**5. Open the frontend** — right-click `frontend/index.html` → **Open with Live Server** (VS Code).
The app will be at `http://127.0.0.1:5500/frontend/index.html`.

> ⚠️ Live Server must use port **5500**. CORS is configured to allow both `127.0.0.1:5500` and `localhost:5500`.

---

## 🗄️ Database

The SQLite database file **`auth_db.sqlite` is included in this repo** — no migration needed, the `Users` table is already set up and ready to use.

> If you need to recreate it from scratch: `npx sequelize-cli db:migrate`

**Why SQLite?** File-based, zero-config, no server required — perfect for local/demo projects.

### Schema — `Users` table

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `username` | VARCHAR(255) | Display name |
| `email` | VARCHAR(255) | Unique login identifier |
| `password` | VARCHAR(255) | **bcrypt hash only** — never plain text |
| `createdAt` | DATETIME | Auto-managed by Sequelize |
| `updatedAt` | DATETIME | Auto-managed by Sequelize |

### Sequelize ORM

This project uses [Sequelize](https://sequelize.org/) instead of raw SQL. It maps JS model definitions to SQL tables and handles all queries automatically.

```js
// models/user.js
User.init({ username: DataTypes.STRING, email: DataTypes.STRING, password: DataTypes.STRING }, ...)
```

| Sequelize call | SQL equivalent |
|---|---|
| `User.findOne({ where: { email } })` | `SELECT * FROM Users WHERE email = ?` |
| `User.create({ username, email, password })` | `INSERT INTO Users ...` |
| `User.findByPk(id)` | `SELECT * FROM Users WHERE id = ?` |

### Password Hashing with bcrypt

Passwords are **hashed before being stored** using bcryptjs (cost factor 10). Plain-text passwords are never saved.

```js
// On register — hash before saving
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(body.password, salt);
await User.create({ username, email, password: hash });

// On login — compare input against stored hash
const isValid = bcrypt.compareSync(body.password, user.password);
```

What gets stored: `mypassword123` → `$2a$10$Xv3k9Qz...` (60-char hash)

---

## ⚙️ How It Works

### Auth Flow

```
[Register]  POST /register  →  validate → check duplicate email → hash password → save to DB
[Login]     POST /login     →  validate → find user → verify bcrypt → sign JWT → return token
[Dashboard] GET  /dashboard →  verifyToken middleware → attach req.user → return welcome msg
[Logout]    POST /logout    →  verifyToken → server ack → client removes token from localStorage
```

### `verifyToken` Middleware

Protects `/dashboard` and `/logout`. Runs before the controller on every request.

1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies signature + expiry with `jwt.verify(token, JWT_SECRET)`
3. Fetches user from DB by `payload.id` — confirms user still exists
4. Attaches `req.user` → calls `next()`
5. Any failure (missing token, expired, user not found) → `401 Access Denied`

### Frontend Token Lifecycle

| Event | Action |
|---|---|
| Successful login | `localStorage.setItem('token', data.token)` |
| Dashboard load | Reads token → sends as `Authorization: Bearer` header |
| Token invalid/expired | Server returns non-OK → client removes token → redirect to login |
| Logout button clicked | Calls `POST /logout` → `finally` block always runs: removes token + redirects |

> JWT is **stateless** — the server never stores tokens. "Logout" means removing the token from `localStorage` so the client can no longer send it. The token remains mathematically valid until expiry, but is effectively useless without a client holding it.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/register` | — | Register new user |
| `POST` | `/login` | — | Login, returns JWT |
| `GET` | `/dashboard` | ✅ Bearer | Get dashboard data |
| `POST` | `/logout` | ✅ Bearer | Logout acknowledgment |

---

## 📁 Project Structure

```
├── app.js                      # Express entry point, routes
├── controllers/AuthController.js  # Register, Login, Dashboard, Logout
├── middlewares/verifyToken.js   # JWT auth middleware
├── models/user.js               # Sequelize User model
├── config/config.json           # DB config (SQLite)
├── migrations/                  # Sequelize migration files
├── auth_db.sqlite               # SQLite DB (included)
├── .env.example                 # Env variable template
└── frontend/
    ├── index.html               # Login page
    ├── register.html            # Register page
    ├── dashboard.html           # Protected dashboard
    ├── style.css                # Styles
    └── js/
        ├── config.js            # API base URL
        ├── auth.js              # Login & register logic
        └── dashboard.js         # Dashboard fetch & logout
```

MRCW
