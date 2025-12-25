# EV Charging Station Management System

A full-stack web application for managing electric vehicle charging stations with real-time mapping, user authentication, and comprehensive CRUD operations.

## 🚀 Live Demo

- **Frontend**: [frontend](https://charging-station-app-8rwu.vercel.app/)
- **Backend API**: [Backend api](https://chargind-station-api.onrender.com)
- **API Documentation**: [Postman Collection]([./[postman_collection.json](https://.postman.co/workspace/My-Workspace~ea95c7ca-7c24-4b37-81f9-4aac33e6d045/collection/21943570-bdb41796-4f95-48be-8b91-8eaf7097a7be?action=share&creator=21943570)](https://identity.getpostman.com/accounts?dwn=1&continue=https%3A%2F%2Fgo.postman.co%2Fworkspace%2FMy-Workspace~ea95c7ca-7c24-4b37-81f9-4aac33e6d045%2Fcollection%2F21943570-bdb41796-4f95-48be-8b91-8eaf7097a7be%3Faction%3Dshare%26creator%3D21943570))

## ✨ Features

### User Management
- **JWT Authentication**: Secure user registration and login
- **Protected Routes**: Station management requires authentication
- **User-specific Permissions**: Users can only edit/delete their own stations

### Station Management
- **Full CRUD Operations**: Create, Read, Update, and Delete charging stations
- **Advanced Filtering**: Filter by status, power output, and connector type
- **Real-time Updates**: Changes reflect immediately across the application

### Interactive Map
- **Visual Station Mapping**: All stations displayed on an interactive map
- **Status Indicators**: Different markers for Active/Inactive stations
- **Detailed Popups**: Click markers to view station details
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt for password hashing
- **Middleware**: CORS enabled

### Frontend
- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Maps**: Leaflet with OpenStreetMap
- **Build Tool**: Vite
- **Styling**: CSS3 with scoped styles

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0 or higher) - Local installation or MongoDB Atlas account

## 🔧 Installation

### Clone the Repository

    git clone https://github.com/yourusername/charging-station-app.git
    cd charging-station-app

Backend Setup

Navigate to the backend directory:

    cd backend
Install dependencies:

    npm install
    
Create a .env file in the backend directory:

    MONGODB_URI=mongodb:your mongoDB url
    JWT_SECRET=key
    PORT=5000
    
Start the backend server:

# Development mode
    npm run dev

# Production mode
    npm start
    
    The backend server will start on http://localhost:5000

Frontend Setup

Open a new terminal and navigate to the frontend directory:

    cd frontend
    Install dependencies:

npm install
Create a .env file in the frontend directory:

    VITE_API_URL=http://localhost:5000/api
Start the frontend development server:

    npm run dev
