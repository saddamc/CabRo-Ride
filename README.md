# 🚗 Ride Booking System

A comprehensive ride booking application similar to Uber featuring a modern React frontend and robust Express.js backend with real-time ride management.

## 🌐 Live Deployment

**Frontend**: [https://ride-5.vercel.app]

**Backend API**: [https://ride-5.vercel.app/api/v1]

## 📋 Project Overview

This full-stack application provides a complete ride booking experience with role-based access for riders, drivers, and administrators. The system handles ride requests, driver matching, real-time tracking, payments, and comprehensive user management.

### 👤 User Management
- Multi-role authentication (Rider, Driver, Admin)
- JWT-based secure authentication with cookies
- Google OAuth integration
- Profile management and verification

### 🚗 Ride Booking
- Real-time ride requests and driver matching
- Interactive map with pickup/dropoff selection
- Fare calculation and ride estimation
- Ride status tracking (requested → accepted → picked up → completed)

### 👨‍💼 Driver Features
- Driver application and approval system
- Online/offline status management
- Earnings tracking and history
- Vehicle information management
- Real-time ride acceptance/rejection

### ⚙️ Admin Panel
- User and driver management
- Ride history and analytics
- Payment monitoring
- System configuration

### 🔔 Real-time Notifications
- Ride status updates
- Driver arrival alerts
- Payment confirmations

## 🛠 Technology Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **Redis** for caching
- **Socket.io** for real-time features

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials
- Redis Cloud account

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
├── server/                 # Express backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/    # Configuration files
│   │   │   ├── middlewares/# Custom middlewares
│   │   │   ├── modules/   # Feature modules
│   │   │   ├── routes/    # API routes
│   │   │   └── utils/     # Utility functions
│   └── dist/              # Compiled output
└── 
```
