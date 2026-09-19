# 🏢 Company Staff Database App

A full-stack employee and department management web application built with **Node.js, Express, MongoDB, PostgreSQL, Sequelize, and Handlebars**. The application provides authenticated users with tools to manage company employees and departments, view employee information, filter staff records, upload images, and maintain user login history.

## 🌐 Live Demo

[Company Staff Database App](https://company-staff-database-app.vercel.app/)

---

## 📌 Overview

The **Company Staff Database App** is a server-side web application designed to provide an organized interface for managing company staff information.

The application includes authentication and session management, employee and department records, filtering functionality, individual employee and department pages, image uploads, and user login history.

The backend is built around an **Express.js server**, while database operations are separated into dedicated data-service modules.

---

## ✨ Features

### 👤 User Authentication

* User registration
* Secure password hashing with `bcryptjs`
* User login and logout
* Session-based authentication
* Protected employee and department routes
* Login history tracking
* User-agent tracking during login

### 👨‍💼 Employee Management

* View all employees
* View individual employee details
* Add new employees
* Update employee information
* Delete employees
* Associate employees with departments
* Filter employees by:

  * Status
  * Department
  * Manager

### 🏢 Department Management

* View all departments
* View individual department information
* Add departments
* Update department information
* Delete departments

### 🖼️ Image Management

* Upload employee/application images
* Store uploaded files in the application's public image directory
* Display uploaded images

### 🔐 Access Control

Protected routes require an authenticated session before users can access employee and department management functionality.

---

## 🛠️ Technologies Used

| Technology          | Purpose                                    |
| ------------------- | ------------------------------------------ |
| **Node.js**         | Server-side JavaScript runtime             |
| **Express.js**      | Web server and routing                     |
| **Handlebars**      | Server-side HTML templating                |
| **MongoDB**         | User authentication and login-history data |
| **Mongoose**        | MongoDB object modeling                    |
| **PostgreSQL**      | Relational application data                |
| **Sequelize**       | PostgreSQL ORM                             |
| **bcryptjs**        | Password hashing                           |
| **client-sessions** | Session management                         |
| **Multer**          | File/image uploads                         |
| **JavaScript**      | Application logic                          |
| **HTML/CSS**        | User interface                             |
| **Vercel**          | Deployment                                 |

The project's `package.json` includes Express, Express Handlebars, Mongoose, Sequelize, PostgreSQL support, Multer, bcryptjs, and client-sessions.

---

## 🏗️ Application Architecture

The application separates the server, database operations, authentication logic, and presentation layer.

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express Server   │
                    │     server.js       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │ Data Service│  │ Auth Service │  │   Handlebars│
       │             │  │             │  │    Views    │
       └──────┬──────┘  └──────┬──────┘  └─────────────┘
              │                │
              ▼                ▼
       ┌─────────────┐  ┌─────────────┐
       │ PostgreSQL  │  │   MongoDB   │
       │ Application │  │    Users    │
       │    Data     │  │   & History │
       └─────────────┘  └─────────────┘
```

---

## 📂 Project Structure

```text
Company-Staff-Database-App/
│
├── public/
│   └── images/
│       └── uploaded/
│
├── views/
│   ├── *.hbs
│   └── ...
│
├── data-service.js
├── data-service-auth.js
├── server.js
│
├── package.json
├── package-lock.json
└── .gitignore
```

### Key Files

#### `server.js`

The main Express application.

Responsibilities include:

* Starting the HTTP server
* Configuring Express
* Configuring Handlebars
* Managing sessions
* Defining application routes
* Authentication middleware
* Employee routes
* Department routes
* Image-upload routes
* Registration/login/logout functionality

The application uses an `ensureLogin` middleware to protect employee and department management routes.

#### `data-service.js`

Handles application data operations, including employee and department queries and updates.

This creates a separation between the Express routing layer and database-related functionality.

#### `data-service-auth.js`

Handles authentication-related database operations.

Responsibilities include:

* User registration
* Password hashing
* User lookup
* Password verification
* Login-history management

Passwords are hashed using `bcryptjs` before users are stored.

#### `views/`

Contains the Handlebars templates used to render application pages.

---

## 🔄 Application Workflow

A typical authenticated workflow looks like:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Authentication
  │
  ├── Invalid → Error Message
  │
  └── Valid
        │
        ▼
   Employee Dashboard
        │
        ├── View Employees
        ├── Filter Employees
        ├── View Employee
        ├── Add Employee
        ├── Update Employee
        └── Delete Employee
        │
        ▼
   Department Management
        │
        ├── View Departments
        ├── Add Department
        ├── Update Department
        └── Delete Department
```

---

## 🔎 Employee Filtering

The application supports filtering employee records using query parameters.

Examples include:

```text
/employees?status=...
/employees?department=...
/employees?manager=...
```

The server determines which database query to execute based on the requested filter.

---

## 🔐 Authentication

The authentication system uses:

* `bcryptjs` for password hashing
* `mongoose` for MongoDB access
* `client-sessions` for session management
* Login-history storage
* User-agent tracking

During authentication, the application verifies the submitted password against the stored password hash and records successful login information.

---

## 🖼️ File Uploads

The application uses **Multer** for image uploads.

Uploaded images are stored under:

```text
public/images/uploaded/
```

Files are assigned timestamp-based filenames to help avoid filename collisions.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* MongoDB

---

### 1. Clone the Repository

```bash
git clone https://github.com/mpatel1802/Company-Staff-Database-App.git
cd Company-Staff-Database-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Database credentials and application secrets should be stored in environment variables rather than directly in source code.

For example:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
```

> Do not commit `.env` files or database credentials to GitHub.

### 4. Start the Application

```bash
npm start
```

The application uses the `start` script defined in `package.json` to launch `server.js`.

By default, the server is configured to use:

```text
http://localhost:8080
```

---

## 🧪 Development

The project includes a basic npm test script, although automated application tests are not currently configured.

```bash
npm test
```

---

## 🧠 Key Concepts Demonstrated

This project demonstrates practical experience with:

* Node.js backend development
* Express.js routing
* REST-style server routes
* Server-side rendering
* Handlebars templating
* MongoDB
* PostgreSQL
* Mongoose
* Sequelize
* Authentication
* Password hashing
* Session management
* CRUD operations
* Database filtering
* Middleware
* File uploads
* Form processing
* Asynchronous JavaScript
* Error handling
* MVC-style application organization

---

## 📚 What I Learned

Through this project, I strengthened my understanding of:

### Backend Development

Building a complete server-side application using Node.js and Express.

### Database Integration

Working with both document-oriented and relational databases and connecting application logic to persistent data.

### Authentication

Implementing registration, password hashing, login verification, sessions, and login-history tracking.

### CRUD Operations

Designing routes and data-service functions that allow users to create, retrieve, update, and delete employee and department records.

### Middleware

Using Express middleware to control access to authenticated routes and manage application state.

### File Handling

Implementing image uploads using Multer and storing uploaded files within the application.

---

## 🔮 Future Improvements

Potential improvements include:

* Move all database credentials and secrets to environment variables
* Add automated unit and integration tests
* Improve validation for employee and department forms
* Add role-based permissions for administrators and regular users
* Improve error messages and user feedback
* Add pagination for larger employee datasets
* Add advanced employee search
* Improve responsive UI design
* Add database migrations and seed scripts
* Improve session security
* Add centralized environment configuration
* Add automated deployment and CI/CD
* Add stronger file-upload validation
* Add API documentation

---

## ⚠️ Security Note

The current repository contains database credentials directly in source code. Before using this project publicly or in a production environment:

1. **Rotate the exposed database password immediately.**
2. Remove hard-coded connection strings.
3. Store credentials in environment variables.
4. Replace hard-coded session secrets.
5. Remove any previously exposed credentials from Git history if necessary.
6. Restrict database access using appropriate network and authentication controls.

The repository's authentication service currently contains a MongoDB connection string directly in the source, so this cleanup should be completed before presenting the repository as a production-ready application.

---

## 👨‍💻 Author

**Mann Patel**

GitHub: [@mpatel1802](https://github.com/mpatel1802)

---

## 📄 License

This project is licensed under the **ISC License** as specified in the project's `package.json`.
