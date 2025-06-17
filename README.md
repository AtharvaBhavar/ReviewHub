# ReviewHub

# ⭐ Ratings & Reviews Web Application

A full-stack web application that allows users to sign up, log in, and provide product ratings and reviews. Built with **React**, **Node.js**, **Express**, **MySQL**, and **Sequelize ORM**.

---

## 🚀 Features

* 🔐 User Authentication (Sign Up & Login)
* ⭐ Star-based Product Rating System
* 💬 Text-based Reviews with Optional Image Upload
* 📦 RESTful API Backend with Data Validation
* 🔒 JWT-based Protected Routes
* 🎨 Responsive, Modern UI using Tailwind CSS
* 📊 Average Rating Calculation per Product
* 🖼️ Image Preview & Enlarged View on Click

---

## 🛠️ Technology Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React.js, Tailwind CSS, Vite |
| Backend        | Node.js, Express.js          |
| Database       | MySQL with Sequelize ORM     |
| Authentication | JWT (JSON Web Tokens)        |
| Dev Tools      | Vite, Nodemon, Postman       |
| File Upload    | Multer                       |

---

## ⚙️ Project Setup Instructions

### 🧬 1. Clone the Repository

```bash
git clone https://github.com/your-username/ratings-review-app.git
cd ratings-review-app
```

### 🛢️ 2. Setup MySQL Database

Open phpMyAdmin or MySQL CLI and create a database named:

```sql
CREATE DATABASE ratings_db;
```

### 🔧 3. Backend Setup (Server)

```bash
cd server
npm install
```

✅ Create a `.env` file in the `server/` directory and add the following:

```env
PORT=5000
DB_NAME=ratings_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_here
```

🔥 Start the backend server:

```bash
npm start
```

This will sync the Sequelize models and start the Express server at `http://localhost:5000`.

### 💻 4. Frontend Setup (Client)

```bash
cd client
npm install
```

✅ Create a `.env` file in the `client/` directory and add the following:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

🚀 Start the frontend React app:

```bash
npm run dev
```

This will run the development server at `http://localhost:5173` (default Vite port).

---

## 🔑 Authentication Flow

* Users sign up to create an account.
* Log in with valid credentials to receive a JWT token.
* JWT is stored locally and sent with every authenticated request (rating/review).
* Unauthorized actions are blocked until login.

---

## 📝 Contribution

If you'd like to contribute, feel free to fork this repo and submit a pull request. Bug fixes, features, and improvements are welcome!

---

## 👨‍💻 Developed By

**Atharva Bhavar**
Feel free to add your portfolio, LinkedIn, or GitHub link here.

---

## 📜 License

This project is open-source and available under the MIT License.
