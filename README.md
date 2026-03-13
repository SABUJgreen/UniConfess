# UniConfess: Anonymous College Confession + Q&A Network

A modern, full-stack web application allowing college students to anonymously share confessions, doubts, gossip, and placement discussions within their college communities utilizing a secure alias identity model.

## Features
- **Anonymous Aliases**: Interact publicly using purely an alias. Your real identity is kept private in the database.
- **College Communities**: Specific feeds and post segregations based on your registered college.
- **Dynamic Content**: Hot, New, and Top feeds utilizing algorithmic sorting based on Upvotes/Downvotes.
- **Engagement**: Share posts, upvote/downvote, and comment anonymously.
- **Modern UI**: Full application styled with an elegant, responsive Dark Theme using Tailwind CSS.

## Tech Stack
**Frontend:**
- Next.js 16 (App Router)
- React
- Tailwind CSS
- React Query (for robust caching and optimistic UI)
- JS-Cookie & Axios

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication & bcrypt

## Local Setup Instructions

### 1. Database Setup
Make sure MongoDB is running locally on port 27017. If using an Atlas cluster, copy the URI.

### 2. Backend Initialization
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables (create a `.env` file):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-confession
   JWT_SECRET=super_secret_jwt_key
   ```
4. Seed the database (Populates 5 initial colleges):
   ```bash
   node seeder.js
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### 3. Frontend Initialization
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (already installed during setup if using package manager context here):
   ```bash
   npm install
   ```
3. Set up environment variables (create a `.env.local` file):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   
### Access the Application
Open `http://localhost:3000` to interact with UniConfess!
