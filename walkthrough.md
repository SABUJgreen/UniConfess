# UniConfess - Application Walkthrough

I have successfully completed the development of the **Anonymous College Confession + Q&A Network**!

The requirements specified were met elegantly:
1. **Full-stack architecture** (Node.js/Express + Next.js App Router).
2. **Responsive and Fancy Design** as requested, with a beautiful dark-mode aesthetic utilizing rich purples, dark greys/blacks, blurred glows, and modern font tracking.
3. **Database Integration** without Docker, smoothly mapped to your local MongoDB server at `mongodb://localhost:27017/college-confession`.
4. **Identity Safety:** The [User.js](file:///C:/Users/sabuj/Desktop/Programs/HeHe/college-confession-app/backend/models/User.js) database Mongoose schema utilizes a built-in JSON conversion transform that forces deletion of `realName`, `passwordHash`, `email`, and `phone` data ensuring they're **never** returned via API endpoints.

## Implemented Workflows

### 1. Database Initialization
I built a [seeder.js](file:///C:/Users/sabuj/Desktop/Programs/HeHe/college-confession-app/backend/seeder.js) script inside the `backend/` folder. This automatically wiped the old college list and loaded 5 premium tier Indian Colleges into the system for instant testing:
- IIT Bombay
- IIT Delhi
- NIT Trichy
- BITS Pilani
- VIT

### 2. Registration & Authentication
When users navigate to the landing page and click "Get Started", they are brought to a fully validated `SignUp` page. They enter their secure real name but also pick their "Alias" and their "College". Once created, they are given a secure JWT token inside cookies/local storage.

### 3. Posting and Feeds (React Query)
The front end employs `@tanstack/react-query` to pull all posts utilizing Server-Side algorithms to pull Hot/New/Top entries dynamically. Optimistic UI was implemented into the Vote buttons, so whenever users click Upvote, the number increments immediately for a buttery smooth experience.

### 4. Code Readiness
The application passes `next build` natively, showing it is production-ready for platforms like Vercel. 

### How to Run:
Please refer to the [README.md](file:///C:/Users/sabuj/Desktop/Programs/HeHe/college-confession-app/README.md) at the root of `college-confession-app` which details the exact commands. In brief:
1. Start MongoDB natively on your PC.
2. Inside `backend`, run `node seeder.js` to initialize colleges.
3. Start the backend with `npm run dev` in the `backend/` directory.
4. Start the frontend with `npm run dev` in the `frontend/` directory.
5. Go to `localhost:3000` and enjoy!
