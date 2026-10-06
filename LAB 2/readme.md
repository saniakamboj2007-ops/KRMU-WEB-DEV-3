# Student Management REST API

## 📌 Project Overview

The Student Management REST API is a backend application developed using **Node.js and Express.js**.

This project provides RESTful APIs to manage student records using CRUD operations. 
The application uses an in-memory JavaScript array to store student data and does not use 
any external database.

This project is developed as part of **Web Development III – Unit 2 Lab Assignment 2**.

---

## 🎯 Objectives

The main objectives of this project are:

- Understand Express.js server setup
- Build REST APIs
- Implement CRUD operations
- Use middleware
- Implement modular routing
- Handle errors and HTTP status codes
- Test APIs using Postman

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- JavaScript
- REST API
- Postman
- VS Code

---

## 📂 Project Structure

```text
student-management-api/
│
├── app.js
├── package.json
├── package-lock.json
│
├── routes/
│   └── studentRoutes.js
│
├── middleware/
│   └── logger.js
│
└── data/
    └── students.js
