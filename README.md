<h1 align="center">E-Commerce Store with AI Chatbot 🛒🤖</h1>

<p align="center">
  A modern, full-stack E-Commerce platform featuring an intelligent AI Chatbot, secure payments, and a seamless shopping experience.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#live-demo">Live Demo</a>
</p>

---

## 🌟 Live Demo

**Check out the live project here:** [https://fashion-shopp.onrender.com/](https://fashion-shopp.onrender.com/)

---

## ✨ Features

- **🤖 AI Shopping Assistant (New!)**: Integrated with Google Generative AI (Gemini) to provide smart, interactive customer support and product recommendations.
- **🔐 Robust Authentication**: Secure user signup and login using JWT (JSON Web Tokens) with both Access and Refresh tokens.
- **🛍️ Complete Shopping Experience**: Browse products by category, manage shopping cart, and seamless checkout process.
- **💳 Secure Payments**: Integrated with **Stripe** for safe and reliable credit card processing.
- **🏷️ Coupon System**: Dynamic discount codes to apply during checkout.
- **👑 Admin Dashboard**: Comprehensive admin panel to manage products, categories, and view sales analytics with interactive charts.
- **🚀 High Performance**: Caching implemented with **Redis** for lightning-fast data retrieval.
- **🖼️ Image Management**: Product images hosted and optimized via **Cloudinary**.
- **🎨 Modern UI/UX**: Beautiful, responsive design built with **Tailwind CSS** and smooth animations powered by **Framer Motion**.

---

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) (State Management)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Recharts](https://recharts.org/) (Data Visualization)
- [React Router DOM](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [Redis](https://redis.io/) (via Upstash / ioredis)
- [Google Generative AI](https://ai.google.dev/) (Gemini AI Chatbot)
- [Stripe](https://stripe.com/) (Payments)
- [Cloudinary](https://cloudinary.com/) (Image Uploads)
- [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://www.npmjs.com/package/bcryptjs)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Redis](https://redis.io/) (Local or Upstash)
- API Keys for Stripe, Cloudinary, and Google Gemini AI.

### Installation

1. **Clone the repository:**
<h1 align="center">E-Commerce Store with AI Chatbot 🛒🤖</h1>

<p align="center">
  A modern, full-stack E-Commerce platform featuring an intelligent AI Chatbot, secure payments, and a seamless shopping experience.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#live-demo">Live Demo</a>
</p>

---

## 🌟 Live Demo

**Check out the live project here:** [https://fashion-shopp.onrender.com/](https://fashion-shopp.onrender.com/)

---

## ✨ Features

- **🤖 AI Shopping Assistant (New!)**: Integrated with Google Generative AI (Gemini) to provide smart, interactive customer support and product recommendations.
- **🔐 Robust Authentication**: Secure user signup and login using JWT (JSON Web Tokens) with both Access and Refresh tokens.
- **🛍️ Complete Shopping Experience**: Browse products by category, manage shopping cart, and seamless checkout process.
- **💳 Secure Payments**: Integrated with **Stripe** for safe and reliable credit card processing.
- **🏷️ Coupon System**: Dynamic discount codes to apply during checkout.
- **👑 Admin Dashboard**: Comprehensive admin panel to manage products, categories, and view sales analytics with interactive charts.
- **🚀 High Performance**: Caching implemented with **Redis** for lightning-fast data retrieval.
- **🖼️ Image Management**: Product images hosted and optimized via **Cloudinary**.
- **🎨 Modern UI/UX**: Beautiful, responsive design built with **Tailwind CSS** and smooth animations powered by **Framer Motion**.

---

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) (State Management)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Recharts](https://recharts.org/) (Data Visualization)
- [React Router DOM](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [Redis](https://redis.io/) (via Upstash / ioredis)
- [Google Generative AI](https://ai.google.dev/) (Gemini AI Chatbot)
- [Stripe](https://stripe.com/) (Payments)
- [Cloudinary](https://cloudinary.com/) (Image Uploads)
- [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://www.npmjs.com/package/bcryptjs)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Redis](https://redis.io/) (Local or Upstash)
- API Keys for Stripe, Cloudinary, and Google Gemini AI.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hotrucdiep21/E-Commerce.git
   cd E-Commerce
   ```

2. **Install dependencies:**
   
   To install backend and frontend dependencies, run:
   ```bash
   npm run build
   ```

### ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
   ```bash
   git clone https://github.com/hotrucdiep21/E-Commerce.git
   cd E-Commerce
   ```

2. **Install dependencies:**
   
   To install backend and frontend dependencies, run:
   ```bash
   npm run build
   ```

### ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MONGO_URI=your_mongodb_connection_string

# Redis Configuration (Upstash or Local)
# Redis Configuration (Upstash or Local)
UPSTASH_REDIS_URL=your_redis_url

# JWT Secrets
# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary Configuration
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Google Gemini AI Configuration (For Chatbot)
GEMINI_API_KEY=your_gemini_api_key

# Application URLs

# Google Gemini AI Configuration (For Chatbot)
GEMINI_API_KEY=your_gemini_api_key

# Application URLs
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(Note: Ensure you add `GEMINI_API_KEY` to support the new AI Chatbot feature.)*

### ▶️ Running the Application

1. **Start the development server (runs the backend):**

   ```bash
   npm run dev
   ```

2. **In a new terminal, start the frontend development server:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser and navigate to:** `http://localhost:5173`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/hotrucdiep21/E-Commerce/issues).

## 📄 License

This project is licensed under the ISC License.

*(Note: Ensure you add `GEMINI_API_KEY` to support the new AI Chatbot feature.)*

### ▶️ Running the Application

1. **Start the development server (runs the backend):**

   ```bash
   npm run dev
   ```

2. **In a new terminal, start the frontend development server:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser and navigate to:** `http://localhost:5173`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/hotrucdiep21/E-Commerce/issues).

## 📄 License

This project is licensed under the ISC License.
