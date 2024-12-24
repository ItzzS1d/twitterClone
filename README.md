# Twitter Clone

**Twitter Clone** is a social media application inspired by Twitter, where users can post tweets, follow others, and engage with a real-time feed. Built with a modern tech stack and organized using the **MVC (Model-View-Controller)** pattern, this project emphasizes performance, scalability, and maintainability.

## 🚀 Features

- **User Authentication**: Secure login and registration using **JSON Web Tokens (JWT)**.
- **Tweeting**: Users can create, edit, delete, and view tweets in a feed.
- **Follow System**: Users can follow/unfollow others and see their tweets in a personalized timeline.
- **Real-time Updates**: Fetch data dynamically using **TanStack Query** for efficient state management.
- **Image Uploads**: Profile pictures and tweet media uploads handled with **Cloudinary**.
- **Responsive Design**: A sleek, mobile-first design powered by **Tailwind CSS**.

## 🛠️ Tech Stack

### Frontend:
- **React JS**: For building a dynamic and responsive user interface.
- **Tailwind CSS**: For fast and modern styling.
- **TanStack Query**: For efficient server state management and real-time data fetching.

### Backend:
- **Express.js**: Lightweight and robust backend framework.
- **MongoDB**: NoSQL database for storing user and tweet data.
- **RESTful API**: For standardized communication between the frontend and backend.
- **JSON Web Tokens (JWT)**: For secure authentication and session management.

### Cloud Services:
- **Cloudinary**: For image hosting and optimized media delivery.

## ⚙️ MVC Architecture

The project is organized using the **MVC pattern**, ensuring separation of concerns and maintainable code.

### **1. Models**
   - Define the structure of your data.
   - Example: User schema and Tweet schema using **Mongoose**.
   - Located in: `server/models/`

### **2. Views**
   - The user interface is handled by the React frontend.
   - Example: Components for rendering tweets, user profiles, and timelines.
   - Located in: `client/src/components/`

### **3. Controllers**
   - Handle application logic and interact with the models.
   - Example: Functions to create, update, delete tweets or handle user authentication.
   - Located in: `server/controllers/`

---



