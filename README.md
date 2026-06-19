<div align="center">

# ⚙️ TESSERACT 2K26 Backend

### Scalable API Infrastructure for Event Registration & Management

![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue?style=for-the-badge)

</div>

---

# 📖 Overview

The TESSERACT Backend serves as the core infrastructure powering the TESSERACT 2K26 event platform.

It manages:

- User Authentication
- Event Registrations
- Contact & Support Queries
- Payment Proof Uploads
- Admin Operations
- Database Management
- Security & Rate Limiting

The backend is designed to provide a secure, scalable, and maintainable API layer capable of handling hundreds of participants and event registrations.

---

# 🎯 Objectives

The backend was developed to:

- Centralize event registration management
- Automate participant tracking
- Secure user authentication
- Simplify query handling
- Manage payment verification workflows
- Provide a scalable foundation for future growth

---

# 🚀 Features

## 🔐 Authentication System

Supports:

- Login
- Logout
- JWT Authentication
- Protected Routes
- Cookie-Based Sessions

---

## 🎪 Event Registration System

Participants can:

- Register for events
- Submit payment proofs
- Register as individuals or teams
- Receive unique registration IDs

Generated IDs:

```text
DRP-00001
DRP-00002
DRP-00003
```

---

## ☁️ Cloudinary Integration

Handles:

- Payment screenshot uploads
- Secure media storage
- Cloud-hosted asset management

---

## 📬 Contact Management

Users can:

- Submit queries
- Contact organizers
- Track query status

Generated IDs:

```text
QRP-00001
QRP-00002
QRP-00003
```

---

## 🛡 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- Protected APIs
- Secure Cookies
- Input Validation

---

## 📊 Admin Features

Administrators can:

- View registrations
- Filter applications
- Search participants
- Manage query status
- Monitor registrations

---

# 🏗 System Architecture

```text
Frontend (React)

        │

        ▼

Express API Server

        │

 ┌──────┴──────┐

 ▼             ▼

MongoDB     Cloudinary

(Database)  (Media Storage)
```

---

# 🛠 Tech Stack

## Backend Framework

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose ODM

## Authentication

- JWT
- Cookie Parser
- bcryptjs

## Cloud Storage

- Cloudinary

## Security

- Express Rate Limit
- JWT Verification
- Secure Cookies

---

# 📂 Project Structure

```text
src
│
├── config
│   └── env.js
│
├── controllers
│   ├── auth.controller.js
│   ├── application.controller.js
│   └── contact.controller.js
│
├── middleware
│   └── auth.middleware.js
│
├── models
│   ├── user.model.js
│   ├── application.models.js
│   ├── contact.model.js
│   ├── applicationCounter.js
│   └── QueryCounter.js
│
├── routes
│   ├── auth.routes.js
│   ├── application.routes.js
│   └── contact.routes.js
│
└── lib
    ├── db.js
    ├── cloudinary.js
    ├── JWTUtils.js
    └── security.js
```

---

# 🔌 API Modules

## Authentication APIs

```http
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/check-auth
```

---

## Application APIs

```http
POST /api/application
GET /api/application
PATCH /api/application
```

Used for:

- Event registrations
- Team registrations
- Status management

---

## Contact APIs

```http
POST /api/contact
GET /api/contact
PATCH /api/contact
```

Used for:

- Query submission
- Query tracking
- Status updates

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

---

# 🚀 Local Setup

Clone repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

---

# 📈 Future Enhancements

- Email Notifications
- OTP Verification
- Payment Gateway Integration
- Admin Analytics Dashboard
- Real-Time Notifications
- Certificate Generation
- QR-Based Event Verification

---

# 👨‍💻 Contributors

### TESSERACT Tech Team

Backend Development

- API Development
- Database Design
- Authentication System
- Cloudinary Integration
- Security Implementation

---

# 🌟 Why This Project Matters

Managing technical fests at scale requires efficient participant tracking, secure registration workflows, and streamlined communication.

The TESSERACT Backend provides a robust foundation that enables organizers to focus on delivering exceptional events while the platform handles operational complexity.

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the repository

🤝 Contribute

🐛 Report Issues

</div>
