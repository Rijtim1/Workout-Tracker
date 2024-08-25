# Workout Tracker README

## Overview

**Workout Tracker** is a comprehensive application designed to help users manage and track their workouts effectively. The project is built with a FastAPI backend and a Next.js frontend, leveraging Docker for containerization.

## Features

- **User Authentication**: Secure user registration and login.
- **Workout Management**: Create, view, update, and delete workout logs.
- **Exercise Catalog**: Browse and search exercises.
- **Dashboard**: Visualize workout statistics and history.

## Project Structure

```plaintext
backend-workout-tracker/
├── Dockerfile
├── requirements.txt
├── src/
│   ├── core/
│   ├── db/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── main.py
client-workout-tracker/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
```

## Prerequisites

- Docker
- Docker Compose (if running both frontend and backend together)
- Node.js (for client development)
- Python 3.12+ (for backend development)

## Installation and Setup

### Backend (FastAPI)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/workout-tracker.git
   cd workout-tracker/backend-workout-tracker
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t workout-tracker-backend .
   ```

3. **Run the Docker container:**

   ```bash
   docker run -d --name workout-tracker-backend -p 8000:8000 workout-tracker-backend
   ```

   This command starts the backend server, which will be accessible at `http://localhost:8000`.

4. **Environment Variables:**

   Ensure the following environment variables are set up in your environment or a `.env` file:
   - `SECRET_KEY`: Your secret key for JWT.
   - `MONGO_URI`: Connection string for MongoDB.

### Frontend (Next.js)

1. **Navigate to the client directory:**

   ```bash
   cd ../client-workout-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   This command starts the frontend development server, which will be accessible at `http://localhost:3000`.

## Usage

### API Endpoints

The backend provides several API endpoints for user management, exercise handling, and workout logging. Below are some key endpoints:

- **User Registration**: `POST /api/user/register_user/`
- **User Login**: `POST /api/user/token`
- **Create Exercise Log**: `POST /api/exercise_logs/`
- **Fetch Exercise Logs**: `GET /api/exercise_logs/`
- **Search Exercises**: `GET /api/exercise/search`

### Running Tests

To run tests for the backend, ensure you have the necessary testing tools installed (like `pytest`) and execute:

```bash
pytest
```

For the frontend, you can run:

```bash
npm test
```

## Docker Compose

If you prefer to run both the frontend and backend together using Docker Compose, you can use the `docker-compose.yml` file located in the root directory of the project:

```bash
docker-compose up --build
```

This command will start both the backend on port 8000 and the frontend on port 3000.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and passes all tests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
