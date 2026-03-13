# Anonymous College Confession + Q&A Network

This plan describes the implementation steps for building the anonymous college confession platform. 

## Proposed Architecture

The application will feature a monolithic repo containing both backend and frontend, and will run locally on your machine.
For the "Colleges" data, we will create a seeding script that inserts a set of initial colleges into the database on first run, ensuring a smooth start.
We will use the absolute latest versions of Next.js, React, and Tailwind CSS. The frontend design will be modern, somewhat fancy, and polished.

### Project Structure

```text
/college-confession-app
├── backend/
│   ├── config/ (db connection, env loader)
│   ├── models/ (Mongoose schemas: User, College, Post, Comment, Vote)
│   ├── routes/ (Express routers)
│   ├── controllers/ (Business logic)
│   ├── middleware/ (JWT validation, error handling)
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/ (Next.js App Router structure)
│   ├── components/
│   ├── hooks/
│   ├── services/ (Axios API client)
│   └── package.json
```

## Database Design (MongoDB)

We will use Mongoose ORM to model 5 collections.
1. **Users**: Real identity, alias, hashed password, and relation to college.
2. **Colleges**: Simple lookup collection containing college details.
3. **Posts**: The main entity with aggregated comment/vote counts and references to the author and college.
4. **Comments**: Associated chronologically with posts.
5. **Votes**: Prevents multi-voting by storing User <-> Post relations and vote type (+1 / -1).

## Backend Implementation

- **REST API**: We will build standard RESTful endpoints.
- **Auth**: JWT stored either in HTTP-only cookies or localStorage (will default to localStorage as requested for standard frontend token usage, though cookies are more secure).
- **Security**: Specific database projection rules will ensure `passwordHash`, `realName`, `email`, and `phone` are never sent from the server.

## Frontend Implementation

- **Framework**: Next.js App Router (`/app`).
- **Styling**: TailwindCSS for modern, responsive aesthetics.
- **State/Caching**: React Query (`@tanstack/react-query`) for feed management and optimistic UI updates for votes.
- **Themes**: We will design a very polished, modern UI with nice clean vibes appropriate for a college network (possibly a premium dark/light mode toggle with vibrant accents for tags/categories).

## Verification Plan

### Automated/Local Tests
- Start MongoDB locally (or use an Atlas URI).
- Start backend (`npm run dev`) and frontend (`npm run dev`).
- Test registration flow, ensuring fake alias works and real names stay hidden.
- Verify JWT issuing and authorization.
- Create cross-college interactions (comments/votes) and verify same-college restriction (posting).

### Manual Verification
- We will provide screenshots and a final walkthrough demonstrating the UI. You can test it on localhost via Docker.

