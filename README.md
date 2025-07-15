# 🚀 MERN Secure CRUD Application with Docker

A modern, full-stack CRUD application built using **MongoDB**, **Express.js**, **React.js**, and **Node.js (MERN)**. It includes secure user authentication with **JWT**, middleware protection, and useful features like:

---

## ✅ Features

- 🔐 **Secure Login & Register** using JWT-based Authentication
- 🧪 **Form Validation** with React Hook Form
- 📦 **RESTful API** built using Express & MongoDB
- 🧱 **Middleware-Protected Routes** for security
- 🔍 Extensible for:
  - 📂 File Uploads
  - 🔢 Pagination
  - 🔎 Search & Filtering
- ⚙️ **Role-based access control** *(optional)*

---

## 🐳 Dockerized Development

This project comes with a complete **Docker setup** for local and production use.

### 🧰 Services

- **Frontend**: React + Vite served using `serve`
- **Backend**: Node.js + Express
- **Database**: MongoDB (official Docker image)

### 📦 Run All Services

```bash
docker compose up --build
