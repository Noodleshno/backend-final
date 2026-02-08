# About Games - News & Reviews Platform

A web application for discovering gaming news and sharing user reviews.  
Backend: Node.js, Express, MongoDB  
Frontend: HTML, CSS, JavaScript

---

## Features

- **User Authentication**: Register and login with JWT-based authentication.
- **Gaming News**: Search for news about any game or view general gaming news (via NewsAPI).
- **User Reviews**: Authenticated users can create, edit, and delete reviews for games.
- **Profile Management**: View and update your user profile (Only in Backend).

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd about-games
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/about-games
JWT_SECRET=your_jwt_secret
NEWS_API_KEY=your_newsapi_key
```

- Get your [NewsAPI key here](https://newsapi.org/).

### 4. Start the Server

```bash
npm start
```

The backend will run on `http://localhost:3000`.

---

## API Endpoints

### Auth

- `POST /api/auth/register`  
  Register a new user.  
  **Body:** `{ username, email, password }`

- `POST /api/auth/login`  
  Login and receive a JWT token.  
  **Body:** `{ email, password }`

### User

- `GET /api/user/profile`  
  Get current user's profile.  
  **Headers:** `Authorization: Bearer <token>`

- `PUT /api/user/profile`  
  Update username or email.  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ username?, email? }`

### News

- `GET /api/news/games`  
  Get general gaming news (from major gaming sites).

- `GET /api/news/search?q=game_name`  
  Search for news about a specific game.

### Reviews

- `POST /api/reviews`  
  Create a review.  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ title, content, rating, game }`

- `GET /api/reviews/all`  
  Get all reviews (public).

- `GET /api/reviews`  
  Get your own reviews.  
  **Headers:** `Authorization: Bearer <token>`

- `GET /api/reviews/:id`  
  Get a review by ID.  
  **Headers:** `Authorization: Bearer <token>`

- `PUT /api/reviews/:id`  
  Update your review.  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ title, content, rating, game }`

- `DELETE /api/reviews/:id`  
  Delete your review.  
  **Headers:** `Authorization: Bearer <token>`

---

## Frontend Usage

1. Open `frontend/login.html` in your browser to register or log in.
2. After login, you will be redirected to `frontend/index.html`.
3. Use the **News** tab to search for game news.
4. Use the **Reviews** tab to post and manage your reviews.

> **Note:** The frontend expects the backend to run on `http://localhost:3000`.

---

## Development

- Backend code: `src/`
- Frontend code: `frontend/`
- MongoDB is required for user and review storage.
- News is fetched live from NewsAPI.

---

## Credits

- [NewsAPI.org](https://newsapi.org/) for news data.
