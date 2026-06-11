<div align="center">

# 🎓 LetLearn

### Learn. Grow. Achieve.

A modern and feature-rich e-learning platform built with the MERN Stack, designed to provide an engaging and seamless learning experience for students and instructors.

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Active-success)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange)

---

*"Empowering learners with accessible and interactive online education."*

</div>

---

## 📖 About

**LetLearn** is a full-stack e-learning platform that enables users to discover, enroll in, and learn from high-quality online courses. The platform focuses on delivering a smooth user experience with secure authentication, intuitive course management, and responsive design.

---

## ✨ Features

### 👨‍🎓 Student
- 🔐 Secure Authentication
- 📚 Browse Available Courses
- 🔎 Search & Filter Courses
- ❤️ Wishlist Courses
- 🛒 Purchase Courses
- 📈 Track Learning Progress
- 🎥 Watch Video Lectures
- 📜 Download Resources
- 🏆 Course Completion Certificates
- 👤 User Dashboard

### 👨‍🏫 Instructor
- ➕ Create Courses
- ✏️ Edit Course Content
- 🎬 Upload Videos
- 📊 Track Student Enrollments
- 💰 Manage Earnings
- 📝 Publish/Unpublish Courses

### 🛡️ Admin
- 👥 User Management
- 📚 Course Management
- 📊 Analytics Dashboard
- 🚨 Report Management
- ⚙️ Platform Settings

---

## 🛠 Tech Stack

### Frontend
- React.js
- JavaScript
- Tailwind CSS / CSS
- Axios
- React Router
- Framer Motion

### Backend
- Node.js
- Express.js
- Middleware: CORS, File Upload, Authentication

### Database
- MongoDB
- Mongoose (ODM)

### Authentication & Security
- JWT (JSON Web Tokens)
- bcrypt (Password Hashing)
- OTP Generation

### File & Image Management
- Cloudinary (Image hosting and manipulation)
- express-fileupload (File upload handling)

### Payment Processing
- Stripe API

### Email Services
- Nodemailer (Email sending)

### Utilities
- dotenv (Environment variable management)
- cookie-parser (Cookie handling)
- otp-generator (OTP generation)

---

## 📂 Project Structure

```
LetLearn/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── assets/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── uploads/
│
├── package.json
├── README.md
└── .env
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Clone Repository

```bash
git clone https://github.com/Priyanshu8709/LetLearn.git
cd LetLearn
```

### Setup Backend

1. Navigate to server directory

```bash
cd server
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in the server directory

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_URI=mongodb://localhost:27017/letlearn

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Client URL
CLIENT_URL=http://localhost:3000

# Email Configuration (Nodemailer)
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# OTP Expiry (in minutes)
OTP_EXPIRE=5
```

4. Run the backend server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Setup Frontend

1. Navigate to client directory

```bash
cd client
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in the client directory (if needed)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Run the frontend development server

```bash
npm start
```

The client will run on `http://localhost:3000`

---

## 🧭 Backend API Routes

Base path: `/api`

### Auth
- `POST /api/auth/send-otp` — send sign-up OTP
- `POST /api/auth/signup` — register user
- `POST /api/auth/login` — authenticate user
- `POST /api/auth/change-password` — change password

### Password Reset
- `POST /api/reset-password` — request password reset email
- `POST /api/reset-password/update` — update password with token

### Courses
- `POST /api/courses` — create course (instructor)
- `GET /api/courses` — list all courses
- `GET /api/courses/top-rated` — list top-rated courses
- `GET /api/courses/tag/:tagId` — list courses by tag
- `GET /api/courses/instructor` — list instructor courses
- `GET /api/courses/student` — list student courses
- `GET /api/courses/:id` — course details
- `PUT /api/courses/:id` — update course (instructor)
- `DELETE /api/courses/:id` — delete course (instructor)
- `POST /api/courses/:id/enroll` — enroll in course (student)
- `PATCH /api/courses/:id/toggle` — enable/disable course (instructor)

### Inquiries
- `POST /api/inquiries` — create inquiry (student)
- `GET /api/inquiries/course/:courseId` — get inquiries for a course (instructor)
- `GET /api/inquiries/all` — get all inquiries (instructor)
- `DELETE /api/inquiries/:inquiryId` — delete inquiry (instructor)

### Profile
- `GET /api/profile` — get current user profile
- `PUT /api/profile` — update current user profile
- `DELETE /api/profile` — delete current user account

### Ratings & Reviews
- `POST /api/ratings` — add rating and review
- `GET /api/ratings/:courseId` — get ratings and reviews
- `DELETE /api/ratings/:courseId` — delete rating and review

### Sections
- `POST /api/sections` — create section (instructor)
- `DELETE /api/sections/:sectionId` — delete section (instructor)
- `PUT /api/sections/:sectionId` — update section (instructor)

### Subsections
- `POST /api/subsections` — create subsection (instructor)
- `DELETE /api/subsections/:sectionId/:subSectionId` — delete subsection (instructor)
- `PUT /api/subsections/:subSectionId` — update subsection (instructor)

### Tags
- `POST /api/tags` — create tag (instructor)
- `GET /api/tags` — list all tags

---

## 🐛 Troubleshooting

### Server Won't Start
- **Error: "Cannot find module"**
  - Solution: Run `npm install` to ensure all dependencies are installed
  - Common missing packages: `cors`, `express-fileupload`, `stripe`
  
- **Error: "Cannot connect to database"**
  - Check if MongoDB is running locally or verify your `DB_URI` in `.env`
  - Ensure the MongoDB connection string is correct
  
- **Environment variables not loading**
  - Verify `.env` file exists in the `server` directory
  - Restart the server after updating `.env`

### CORS Issues
- Ensure `CLIENT_URL` in `.env` matches your frontend URL
- Check that `cors` package is installed

### File Upload Issues
- Ensure `express-fileupload` is installed
- Check that `/tmp/` directory exists (or update `tempFileDir` in index.js for your OS)
- Verify Cloudinary credentials are correctly set in `.env`

### Payment Issues
- Ensure `stripe` package is installed
- Verify `STRIPE_SECRET_KEY` is correctly set in `.env`

- AI Course Recommendations
- AI Learning Assistant
- Live Classes
- Group Discussions
- Course Reviews
- Referral System
- Mobile Application
- Multi-language Support
- Dark Mode
- Gamification

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

<div align="center">

## ⭐ If you like LetLearn, don't forget to star the repository!

### Built with ❤️ using the MERN Stack

**Learn • Build • Grow**

</div>
