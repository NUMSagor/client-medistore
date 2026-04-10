# 💊 MediStore – Full Stack Medicine Store Web App

**MediStore** is a full-stack medicine e-commerce platform where customers can browse medicines, sellers can manage inventory, and admins control the entire system.

Built with a modern production-ready stack using **Next.js, TypeScript, Express, Prisma, PostgreSQL**, and deployed on **Vercel**.

---

# 🌐 Live Links

Frontend Live
👉 https://client-medistore.vercel.app/

Backend Live
👉 https://medistore-server.vercel.app/

Frontend Repository
👉 https://github.com/NUMSagor/client-medistore.git

Backend Repository
👉 https://github.com/NUMSagor/medistore-server.git

---

# 👤 Demo Login Credentials

### 👑 Admin Access

Email: [smadmin@gmail.com](mailto:smadmin@gmail.com)
Password: sagor123450

### 🏪 Seller Access

Email: [halim@gmail.com](mailto:halim@gmail.com)
Password: halim123450

### 🧑 Customer Access

Email: [rasel@gmail.com](mailto:rasel@gmail.com)
Password: rasel123450

---

# 🚀 Features

## 👑 Admin Panel

* Manage users
* Manage sellers
* Manage medicines
* Manage categories
* View platform statistics
* Control order status

## 🏪 Seller Dashboard

* Add medicines
* Update medicines
* Delete medicines
* Manage inventory
* Track orders

## 🧑 Customer Features

* Browse medicines
* Filter medicines by category
* View medicine details
* Add to cart
* Checkout system
* Order history tracking
* Profile management

## 🔐 Authentication System

* Role-based authentication
* Admin / Seller / Customer access control
* Protected dashboard routes
* Secure API authorization

---

# 🛠️ Tech Stack

## Frontend

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Next.js (App Router) | SSR + Routing           |
| TypeScript           | Type Safety             |
| Tailwind CSS         | UI Styling              |
| Context API          | Global State Management |

---

## Backend

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime               |
| Express.js | REST API              |
| PostgreSQL | Database              |
| Prisma ORM | Database Access Layer |
| TypeScript | Type Safety           |

---

## Deployment

| Service | Purpose                          |
| ------- | -------------------------------- |
| Vercel  | Frontend Hosting                 |
| Vercel  | Backend Hosting (Serverless API) |

---

# 📂 Project Architecture







# ⚙️ Environment Variables Setup

## Frontend (.env)

NEXT_PUBLIC_API_URL=your_backend_url

Example:

NEXT_PUBLIC_API_URL=https://medistore-server.vercel.app

---

## Backend (.env)

DATABASE_URL=your_postgres_connection_string

JWT_SECRET=your_secret_key

FRONTEND_URL=https://client-medistore.vercel.app





# 🧪 API Base URL

https://medistore-server.vercel.app/api

Example:

GET /medicines
POST /orders
POST /auth/login

---

# 🔐 Role-Based Access Structure

| Role     | Access              |
| -------- | ------------------- |
| Admin    | Full control        |
| Seller   | Medicine management |
| Customer | Purchase medicines  |

---

# 📊 Database Schema Highlights

Main entities:

* User
* Medicine
* Category
* Order
* OrderItem
* Role

Managed using **Prisma ORM** with PostgreSQL.

---

# ✨ Key Highlights of This Project

✔ Full-stack production structure
✔ Role-based authentication
✔ Secure REST API
✔ Prisma ORM integration
✔ PostgreSQL relational database
✔ Serverless backend deployment
✔ Next.js App Router architecture
✔ Clean modular backend architecture

---

# 📸 Future Improvements

* Online payment integration
* Medicine prescription upload feature
* Email notifications
* Admin analytics dashboard charts
* Review & rating system

---

# 👨‍💻 Author

Sagor
GitHub: https://github.com/NUMSagor

---

# ⭐ Support

If you like this project, consider giving it a **star ⭐** on GitHub.
