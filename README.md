# 🎓 Smart Student Management System

A full-stack web application for managing students, courses, attendance, and grades.

## 🛠️ Tech Stack

### Backend
- Java 21 + Spring Boot 3.2
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- MySQL Database
- Maven

### Frontend (Coming Soon)
- React (Vite)
- Axios
- React Router
- Chart.js

## ✨ Features

- 🔐 JWT Authentication with Role-based Access (Admin, Lecturer, Student)
- 👨‍🎓 Student Management (CRUD)
- 📚 Course Management (CRUD)
- 📋 Enrollment Management
- ✅ Attendance Tracking
- 📊 Marks & Automatic GPA Calculator
- 📈 Dashboard with Statistics

## 🚀 Getting Started

### Prerequisites
- Java 21
- MySQL 8.0
- Maven 3.8+
- Node.js 18+ (for frontend)

### Backend Setup

1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/smart-student-management-system.git
\`\`\`

2. Create MySQL database
\`\`\`sql
CREATE DATABASE smart_sms;
\`\`\`

3. Update `application.properties`
\`\`\`properties
spring.datasource.username=root
spring.datasource.password=your_password
\`\`\`

4. Run the application
\`\`\`bash
cd backend
./mvnw spring-boot:run
\`\`\`

5. API runs on: `http://localhost:8080`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Create student |
| GET | `/api/courses` | Get all courses |
| POST | `/api/enrollments` | Enroll student |
| POST | `/api/attendance` | Mark attendance |
| POST | `/api/marks` | Add marks |
| GET | `/api/marks/gpa/student/{id}` | Get GPA |

## 👤 Default Admin Credentials
\`\`\`
Email: admin@smartsms.com
Password: Admin@123
\`\`\`

## 📁 Project Structure
\`\`\`
backend/
├── src/main/java/com/smartsms/
│   ├── config/          # CORS Config
│   ├── controller/      # REST Controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA Entities
│   ├── exception/       # Exception Handlers
│   ├── repository/      # JPA Repositories
│   ├── security/        # JWT Security
│   └── service/         # Business Logic
└── src/main/resources/
    └── application.properties
\`\`\`

## 🧑‍💻 Author
**Your Name**
- GitHub: [@your_username](https://github.com/your_username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your_profile)
