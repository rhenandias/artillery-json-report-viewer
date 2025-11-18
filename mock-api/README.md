# Mock API for Artillery Tests

A simple REST API built with Express.js to generate realistic test data for Artillery.

## About

This mock API simulates a user management system with full CRUD operations. It was specifically designed to:

- Generate Artillery reports with realistic data
- Test different load scenarios
- Simulate variable delays and errors
- Facilitate development of the viewer application

## Installation

```bash
cd mock-api
npm install
```

## How to Run

### Production Mode

```bash
npm start
```

### Development Mode (with auto‑reload)

```bash
npm run dev
```

The API will be available at: **http://localhost:3001**

## Available Endpoints

### 1. Health Check

```http
GET /health
```

Returns the API status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-18T19:39:00.000Z"
}
```

---

### 2. List Users

```http
GET /api/users?page=1&limit=10
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2025-11-18T19:39:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

**Delay:** 10‑50 ms

---

### 3. Get User by ID

```http
GET /api/users/:id
```

**Response (200):**

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2025-11-18T19:39:00.000Z"
}
```

**Response (404):**

```json
{
  "error": "User not found"
}
```

**Delay:** 20‑200 ms (variable)

---

### 4. Create User

```http
POST /api/users
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@example.com"
}
```

**Response (201):**

```json
{
  "id": 4,
  "name": "Maria Santos",
  "email": "maria@example.com",
  "createdAt": "2025-11-18T19:39:00.000Z"
}
```

**Response (400):**

```json
{
  "error": "Name and email are required"
}
```

**Response (409):**

```json
{
  "error": "Email already registered"
}
```

**Delay:** 50‑150 ms

---

### 5. Update User

```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com"
}
```

**Response (200):**

```json
{
  "id": 1,
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "createdAt": "2025-11-18T19:39:00.000Z",
  "updatedAt": "2025-11-18T19:40:00.000Z"
}
```

**Delay:** 50‑150 ms

---

### 6. Delete User

```http
DELETE /api/users/:id
```

**Response (204):** No content

**Response (404):**

```json
{
  "error": "User not found"
}
```

**Delay:** 30‑100 ms

---

### 7. Slow Endpoint (for testing)

```http
GET /api/slow?delay=2000
```

**Query Parameters:**

- `delay` (optional): Delay in milliseconds (default: 2000)

**Response:**

```json
{
  "message": "Slow response",
  "delay": 2000
}
```

---

### 8. Random Error Endpoint (for testing)

```http
GET /api/error
```

Randomly returns:

- 30 % chance: 500 (Internal Server Error)
- 30 % chance: 503 (Service Unavailable)
- 40 % chance: 200 (Success)

---
