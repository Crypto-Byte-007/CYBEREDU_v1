# 🧪 CyberEdu Platform – Local Testing Checklist & Verification Guide

> **Purpose**: This document provides a **complete, step-by-step local testing checklist** to verify that the CyberEdu platform (Database, Backend, Frontend, Authentication, Labs, Reports, Leaderboard) is **working correctly** on a local machine.
>
> **Audience**: Developers, testers, reviewers, mentors, evaluators, or startup stakeholders.
>
> **Outcome**: If all steps pass, the system is considered **locally production-ready** and eligible to move to **Stage 4 (Security & Documentation)**.

---

## 📌 System Overview

CyberEdu is a full-stack cybersecurity education platform consisting of:

- **Database**: MongoDB
- **Backend**: NestJS (REST API, JWT authentication)
- **Frontend**: HTML, CSS, Vanilla JS (served locally)
- **Auth**: JWT Access + Refresh Tokens

---

## 🔧 Environment Prerequisites

Ensure the following are installed:

- Node.js 16+
- npm
- MongoDB Server
- Python 3.x (for frontend local server)
- Modern browser (Chrome / Edge / Firefox)

---

# ✅ STAGE 1 — DATABASE VERIFICATION (MongoDB)

### 1.1 Start MongoDB Service

**Command (Windows – Admin CMD):**
```cmd
net start MongoDB
```

**Expected Output:**
```
The MongoDB service was started successfully.
```

---

### 1.2 Open MongoDB Shell

```cmd
mongosh
```

**Expected Output:**
```
Connecting to: mongodb://127.0.0.1:27017/
>
```

---

### 1.3 Verify Database & Collections

```js
use cyberedu
show collections
```

**Expected Output:**
```
users
labs
notifications
```

✅ Database is ready.

---

# ✅ STAGE 2 — BACKEND VERIFICATION (NestJS API)

### 2.1 Start Backend Server

```bash
cd cyberedu-backend
npm install
npm run start:dev
```

---

### 2.2 Backend Startup Validation

**Expected Terminal Logs:**
```
Nest application successfully started
Database connected successfully
Labs loaded successfully
```

---

### 2.3 Health API Test

**Browser URL:**
```
http://localhost:3000/api/v1/health
```

**Expected JSON:**
```json
{
  "status": "ok",
  "uptime": 123.45
}
```

✅ Backend is healthy.

---

# ✅ STAGE 3 — FRONTEND VERIFICATION

### 3.1 Start Frontend Server

```bash
cd cyberedu-frontend
python -m http.server 8080
```

**Browser URL:**
```
http://localhost:8080
```

**Expected:**
- Website loads
- No blank page
- No red console errors

---

### 3.2 Frontend Asset Check

**CMD Logs Should Show:**
```
GET /assets/js/*.js 200
GET /assets/css/*.css 200
```

404 for `favicon.ico` is acceptable.

---

# ✅ STAGE 4 — AUTHENTICATION TESTING

### 4.1 User Registration Test

**Action:**
- Go to Register page
- Enter:
  - Email: `student@test.com`
  - Password: `Student123`
  - First Name / Last Name

**Network Tab:**
```
POST /api/v1/auth/register → 201 Created
```

---

### 4.2 Login Test

**Action:**
- Login with the same credentials

**Expected:**
```
POST /api/v1/auth/login → 200 OK
```

**UI Result:**
- Redirect to Dashboard
- Navbar visible

---

### 4.3 Token Storage Verification

**Browser:**
```
DevTools → Application → Local Storage
```

**Expected Keys:**
```
accessToken
refreshToken
user
```

---

### 4.4 Auto Login (Session Persistence)

**Action:**
- Refresh browser

**Expected:**
- User remains logged in
- Dashboard loads automatically

---

### 4.5 Logout Test

**Action:**
- Click Logout
- Refresh page

**Expected:**
- Redirect to login
- Tokens cleared

---

# ✅ STAGE 5 — LAB SYSTEM TESTING

### 5.1 Labs API Validation

**Network Tab:**
```
GET /api/v1/labs → 200 OK
```

**Expected Data:**
- Lab IDs (S001, S002, …)
- Titles, difficulty, points

---

### 5.2 Lab Execution Test

**Action:**
- Open Lab S001
- Complete all steps
- Submit lab

**Expected:**
- Success message
- Points awarded

---

### 5.3 Progress Persistence

**Action:**
- Refresh page

**Expected:**
- Lab still marked completed
- Points retained

---

# ✅ STAGE 6 — REPORTS & ANALYTICS

### 6.1 Reports Page

**Expected:**
- Completed labs listed
- Charts rendered
- No console errors

---

### 6.2 Leaderboard Page

**Expected:**
- User visible
- Rank calculated
- Highlighted current user

---

# ✅ STAGE 7 — SECURITY & NEGATIVE TESTS

| Test | Expected Result |
|----|----------------|
| Access API without login | 401 Unauthorized |
| Tamper accessToken | Forced logout |
| Access admin route as student | Blocked |
| Invalid credentials | 401 |

---

# 🧾 FINAL LOCAL TESTING SIGN-OFF

Mark all completed:

- ⬜ MongoDB connected
- ⬜ Backend healthy
- ⬜ Frontend loads
- ⬜ Register works
- ⬜ Login works
- ⬜ Tokens stored
- ⬜ Auto-login works
- ⬜ Labs load & complete
- ⬜ Reports render
- ⬜ Leaderboard updates
- ⬜ Logout works


### ✅ RESULT

If **all boxes are checked**, the CyberEdu platform is:

> 🟢 **LOCALLY VERIFIED & FUNCTIONALLY COMPLETE**

---

# 🚀 NEXT OFFICIAL STEP

➡️ **Stage 4 — Security Testing & Documentation**
- Token refresh documentation
- API security notes
- User manual
- Admin guide

---

**Prepared for:** CyberEdu Platform
**Status:** Local Testing Complete

