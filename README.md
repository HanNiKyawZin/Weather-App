# 🚀 Forum Blog - Laravel Project

A feature-rich forum and blogging web application built with the Laravel framework. This platform enables users to engage in discussions, share content, and manage posts within a responsive, modern interface.

---

## 📋 Features
- **User Authentication:** Secure registration and login system.
- **Content Management:** Create, edit, and delete forum posts (Full CRUD).
- **Discussion System:** Interactive comment system for user engagement.
- **Database Management:** Optimized data handling using Laravel Eloquent ORM.
- **Responsive Design:** Fully mobile-friendly UI built with Bootstrap.
- **Cloud Database:** Integrated with Railway for reliable remote database hosting.

---

## 🛠️ Technologies Used
- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript
- **Backend/Database:** PHP 8+, Laravel Framework
- **Database:** MySQL (Hosted on Railway)
- **Build Tools:** Node.js, NPM (Vite/Mix for asset compilation)

---

## 🚀 Installation & Setup
To run this project locally, follow these steps:
### 1. **Clone the repository:**
   git clone https://github.com/HanNiKyawZin/forum_blog.git

### 2. Install PHP Dependencies
composer install

### 3. Install Frontend Dependencies & Build Assets
npm install

**Then build assets:**
 npm run build

### 4. Environment Configuration
- Copy .env.example to .env
- Configure your database credentials (including Railway host details) inside the .env file.

### 5. Initialize Application
php artisan key:generate

php artisan migrate

### 6. Start the Server
php artisan serve

Access the app at: http://localhost:8000

---

## 📁 Project Architecture
├── **app/**               # Core Laravel logic (Models, Controllers)

├── **database/**          # Migrations and Seeds

├── **public/**            # Compiled assets (CSS, JS, Images)

├── **resources/**         # Frontend Blade templates & Sass

└── **routes/**            # Web and API routes

---

## 📜 Credits & License
- **Framework:** [**Laravel**](https://laravel.com/)
- **Database Hosting:** [**Railway**](https://railway.app/)
- **License:** MIT License. Free for personal and educational use.
