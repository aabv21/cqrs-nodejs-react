# CQRS Blog Application

A modern blog application implementing the Command Query Responsibility Segregation (CQRS) pattern. This architecture separates read and write operations into distinct services, providing better scalability and maintainability.

## Architecture Overview

The application consists of four main services:

### 1. API Gateway (Port 3000)

- Acts as a reverse proxy and single entry point for all client requests
- Routes write operations (POST, PUT, DELETE) to the Commands service
- Routes read operations (GET) to the Queries service
- Handles cross-cutting concerns like CORS and request logging

### 2. Commands Service (Port 3001)

- Handles all write operations (create/delete posts and comments)
- Uses MySQL for transactional data storage
- Publishes events to RabbitMQ when state changes occur
- Implements strict data validation and business rules

### 3. Queries Service (Port 3002)

- Handles all read operations (fetch posts and comments)
- Uses MongoDB for optimized read operations
- Subscribes to RabbitMQ events to maintain data consistency
- Provides paginated and filtered data access

### 4. UI Service

- React-based frontend application
- Modern UI components using Shadcn/UI
- Real-time updates through event-driven architecture
- Responsive and user-friendly interface

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express.js
- MySQL (Commands Service)
- MongoDB (Queries Service)
- RabbitMQ (Event Bus)

### Frontend

- React
- TypeScript
- React Router
- Shadcn/UI
- Tailwind CSS

## Features

- Create, read, and delete blog posts
- Add and delete comments on posts
- Event-driven architecture for real-time updates
- Separation of read and write concerns (CQRS)
- Responsive and modern UI
- Error handling and validation
- Logging and monitoring

## API Endpoints

### Posts

- `GET /api/posts` - Get all posts (Queries Service)
- `GET /api/posts/:id` - Get a single post with comments (Queries Service)
- `POST /api/posts` - Create a new post (Commands Service)
- `DELETE /api/posts/:id` - Delete a post (Commands Service)

### Comments

- `POST /api/posts/:id/comments` - Add a comment to a post (Commands Service)
- `DELETE /api/posts/:postId/comments/:commentId` - Delete a comment (Commands Service)

## Getting Started

1. Clone the repository
2. Install dependencies for each service:
   ```bash
   cd api-gateway && npm install
   cd ../commands && npm install
   cd ../queries && npm install
   cd ../ui && npm install
   ```
3. Set up your environment variables:
   - MySQL connection for Commands Service
   - MongoDB connection for Queries Service
   - RabbitMQ connection details
4. Start the services:

   ```bash
   # Start each service in a separate terminal
   cd api-gateway && npm start
   cd commands && npm start
   cd queries && npm start
   cd ui && npm start
   ```

5. Access the application at `http://localhost:5173`

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
