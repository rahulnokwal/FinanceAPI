# 🚀 Expense Tracker REST API

A production-grade, highly secure RESTful API for an Expense Tracking application. Built with Node.js, Express, and MongoDB, this project focuses heavily on backend architecture, data security, high-performance data analytics, and file handling.

## ✨ Key Features

- **Robust Authentication & Authorization:** Secure user registration, login, and token refreshing using JWT (JSON Web Tokens) and Bcrypt password hashing.
- **Data Security (IDOR Prevention):** Strict ownership checks on every CRUD operation. Users can mathematically only access, update, or delete their own financial data.
- **Advanced Data Analytics:** Utilizes complex MongoDB Aggregation Pipelines (`$match`, `$group`, `$cond`) to instantly calculate dashboard metrics like "Spent This Week" and "Category Breakdowns" in a single database hit.
- **File Handling:** Integrated Multer for handling multipart form data, allowing users to securely upload and update profile pictures.
- **Optimized Performance:** Manual backend pagination (`skip` and `limit`) and dynamic filtering to ensure the server remains lightning-fast, even with thousands of database records.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Security:** JSON Web Tokens (JWT), Bcrypt, CORS
- **Other Utilities:** Multer, Cloudinary, Cookie-parser

---

## 📡 API Reference

### 🔐 Users & Authentication (`/api/v1/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new user *(Supports `profile` image upload)* | ❌ |
| `POST` | `/login` | Authenticate user & get tokens | ❌ |
| `POST` | `/logout` | Clear user tokens securely | ✅ |
| `POST` | `/refreshtokens` | Generate a new access token using a refresh token | ❌ |
| `GET` | `/current-user` | Get current logged-in user details | ✅ |
| `PATCH` | `/profile` | Update profile picture *(Supports `profile` image upload)* | ✅ |
| `PATCH` | `/info` | Update basic user information | ✅ |
| `POST` | `/change-password` | Change account password | ✅ |
| `POST` | `/forget-password` | Initiate password reset flow via email | ❌ |

### 📊 Dashboard Analytics (`/api/v1/dashboard`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/stats` | Get global overview totals (Spent today, week, month, year) | ✅ |
| `GET` | `/category-chart` | Get total spent grouped dynamically by distinct categories | ✅ |

### 💰 Expenses (`/api/v1/expenses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/add-expenses` | Create a new financial expense | ✅ |
| `GET` | `/get-expenses` | Get all expenses (Supports pagination & query filters) | ✅ |
| `GET` | `/get-expense/:id` | Get a specific expense by its ID | ✅ |
| `PATCH` | `/update-expense/:id` | Update an existing expense securely | ✅ |
| `DELETE` | `/delete-expense/:id` | Delete an expense securely | ✅ |

---

## 🗺️ Future Roadmap

This backend foundation is built to scale. The upcoming features planned for this project include:

- [ ] **React Frontend Application:** Building a modern, responsive UI using Vite, Tailwind CSS, and Axios Interceptors to consume this API.
- [ ] **Complete Password Reset Flow:** Finalizing the frontend-to-backend connection for secure, time-sensitive password reset links via email.
- [ ] **Export to CSV:** Allowing users to download their financial data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A MongoDB URI (Local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/rahulnokwal/FinanceAPI.git](https://github.com/rahulnokwal/FinanceAPI.git)
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory and add your variables:
    ```
    MONGODB_URL=mongodb+srv://user:<db_password>@cluster0.lvzmnkm.mongodb.net
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=YOUR_TOKEN_SECRET
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=YOUR_TOKEN_SECRET
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUDNAME=YOUR_CLOUDINARY_CONFIG
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_CONFIG
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_CONFIG
    ```
4. Start the server:
   ```bash
   npm run dev
   ```
