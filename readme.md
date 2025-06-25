# IdeaDrop API

This is the Node.js/Express backend for the IdeaDrop project from my Modern React From The Beginning course. It includes a full CRUD API with protected routes and authentication using JWT access tokens as well as a refresh token.

## Usage

Install dependencies

```bash
npm install
```

## Environment Variables

Rename the `example.env` to `.env` and add the following:

```
MONGO_URI="YOUR MONGODB ATLAS URL"
JWT_SECRET="ADD A SECRET"
```

## Run Server

```bash
npm run dev
```

## How Authentication Works

The user hits the `/login` or `/register` endpoint and gets back the user and a short-lived access token that is valid for 1 minute (you can change if you want) in the response. It also stores a long-lived (30 days) refresh token in an HTTP-only cookie, which can be used to generate access tokens.

The access token can be sent in the header authorization as a bearer token to access protected routes such as `POST /api/ideas`. It expires after a short time and then you can hit the `/api/auth/refresh` endpoint and it will generate a new access token using the refresh token in the HTTP-only cookie.

## Routes

## Routes

### 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint    | Description                              | Auth Required   |
| ------ | ----------- | ---------------------------------------- | --------------- |
| POST   | `/register` | Register a new user                      | ❌ No           |
| POST   | `/login`    | Log in an existing user                  | ❌ No           |
| POST   | `/logout`   | Log out and clear refresh token          | ✅ Yes (cookie) |
| POST   | `/refresh`  | Get new access token using refresh token | ✅ Yes (cookie) |

> 📝 The refresh token is stored in an **HTTP-only cookie**.  
> 🔐 Access tokens must be sent as a **Bearer token** in the `Authorization` header for protected routes.

---

### 💡 Idea Routes (`/api/ideas`)

| Method | Endpoint | Description                    | Auth Required         |
| ------ | -------- | ------------------------------ | --------------------- |
| GET    | `/`      | Get all public ideas           | ❌ No                 |
| GET    | `/:id`   | Get a single idea by ID        | ❌ No                 |
| POST   | `/`      | Create a new idea              | ✅ Yes (access token) |
| PUT    | `/:id`   | Update an idea (only if owner) | ✅ Yes (access token) |
| DELETE | `/:id`   | Delete an idea (only if owner) | ✅ Yes (access token) |
