
# LMS Backend - Spring Boot + MongoDB

This is the backend service for the Learning Management System (LMS) application.

## Requirements

- Java 17+
- Maven
- MongoDB (running on localhost:27017)

## Setup

1. Make sure MongoDB is running on your system
   ```
   mongod --dbpath /path/to/data/directory
   ```

2. Build the application
   ```
   mvn clean install
   ```

3. Run the application
   ```
   mvn spring-boot:run
   ```

The application will start on port 8080.

## Default Users

The application initializes with two default users:

- Admin User:
  - Username: admin
  - Password: admin123

- Student User:
  - Username: student
  - Password: student123

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Courses (Public)

- `GET /api/courses/all` - Get all courses
- `GET /api/courses/{id}` - Get course by ID

### Admin Endpoints

- `POST /api/courses/admin/create` - Create a new course
- `PUT /api/courses/admin/{id}` - Update a course
- `DELETE /api/courses/admin/{id}` - Delete a course

### Student Endpoints

- `GET /api/courses/enrolled` - Get enrolled courses
- `POST /api/courses/enroll` - Enroll in a course
- `GET /api/courses/enrollments` - Get all enrollments
- `GET /api/courses/enrollment/{courseId}` - Get specific enrollment
- `POST /api/courses/progress/{courseId}` - Update module progress
