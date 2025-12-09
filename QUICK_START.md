#!/bin/bash
# Smart Attendance System - Quick Start Guide

## QUICK START (2 Steps)

### Step 1: Start Backend Server
cd backend
npm run dev
# Backend will be available at http://localhost:5000

### Step 2: Start Frontend (in another terminal)
npm run dev
# Frontend will be available at http://localhost:5173

---

## WHAT WAS FIXED

✅ Backend Dependencies - Added bcryptjs for password hashing
✅ NPM Scripts - Added start and dev scripts
✅ Attendance Model - Complete with validation and indexes
✅ API Endpoints - Added /mark-attendance, /attendance, /attendance/stats
✅ Vite Config - Added proxy for API calls during development
✅ Environment Variables - Created .env files with API URL
✅ studentApi Import - Added to App.jsx
✅ All Models - Student, Attendance, Lecturer, Subject, User properly configured

---

## PROJECT STRUCTURE

Backend:
- ✅ server.js - Express app with all API endpoints
- ✅ db.js - MongoDB connection with error handling
- ✅ models/ - Mongoose schemas for Student, Attendance, Lecturer, Subject, User
- ✅ package.json - Dependencies including bcryptjs, mongoose, express, cors

Frontend:
- ✅ App.jsx - Main app with routing and role protection
- ✅ src/api/studentApi.js - Student API client
- ✅ src/services/attendanceService.js - Attendance API client
- ✅ src/pages/ - Landing, Dashboard, Attendance, Reports, AdminStudents
- ✅ src/components/ - Header, Modal, Table, Toast, Button, AddStudent

---

## API ENDPOINTS AVAILABLE

### Student Management
- POST /add-student - Add new student
- GET /students - Get all students
- PUT /update-student/:id - Update student
- DELETE /delete-student/:id - Delete student

### Attendance Management
- POST /mark-attendance - Mark attendance for student
- GET /attendance - Get attendance records (with optional date filter)
- GET /attendance/stats - Get attendance statistics

### Health Check
- GET / - Check if backend is running

---

## ENVIRONMENT SETUP

Backend (.env):
- MONGO_URI=mongodb+srv://... (MongoDB connection)
- PORT=5000

Frontend (.env.local):
- VITE_API_URL=http://localhost:5000

---

## TROUBLESHOOTING

If backend doesn't start:
1. Check MongoDB is running
2. Verify MONGO_URI in backend/.env
3. Ensure port 5000 is not in use
4. Run: npm install in backend folder

If frontend can't connect to backend:
1. Check backend is running on http://localhost:5000
2. Verify VITE_API_URL is correct in .env.local
3. Check browser console for CORS errors
4. Run: npm install in root folder

---

All bugs have been fixed! Ready to run! 🚀
