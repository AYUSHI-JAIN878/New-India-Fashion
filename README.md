# 🛍️ New India Fashion

A modern **MERN Stack fashion e-commerce website** designed for a smooth, responsive, and user-friendly online shopping experience.

New India Fashion focuses on women's fashion categories such as **Ladies Suits, Gowns, Crop Tops, Indo-Western and Palazzo** with features like product search, wishlist, cart, checkout, orders and image search.

---

## ✨ Features

### 👗 Shopping

* Browse fashion products
* Category-based product listing
* Product search
* Product details
* Size and color selection
* Product quantity management
* Featured and new-arrival products
* Product image gallery

### ❤️ Wishlist

* Add products to wishlist
* Remove products from wishlist
* View saved products
* Login-protected wishlist

### 🛒 Cart

* Add products to cart
* Update product quantity
* Remove products
* Clear cart
* Automatic subtotal calculation
* Shipping calculation

### 👤 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* User profile
* Logout functionality

### 📦 Orders

* Checkout process
* Shipping address
* Cash on Delivery support
* Order creation
* Order history
* Order details
* Order cancellation
* Order status tracking

### 🔎 Image Search

* Upload a fashion image
* Image-search API structure
* Ready for future AI-based similar product matching

### 💳 Payment

* Razorpay integration structure
* Payment service prepared for future online payment implementation

### ☁️ Cloud Storage

* Cloudinary integration for product images

### 📧 Email

* Email service structure for future:

  * Order confirmation
  * Registration emails
  * Order updates

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### Other Technologies

* Cloudinary
* Multer
* Razorpay
* Nodemailer
* QRCode

---

## 📂 Project Structure

```text
New India Fashion/
│
├── client/
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/new-india-fashion.git
cd new-india-fashion
```

---

## 💻 Frontend Setup

Open a terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

Create a `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ⚙️ Backend Setup

Open another terminal:

```bash
cd server
npm install
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
SHOP_EMAIL=your_shop_email@gmail.com
```

> **Important:** Never commit `.env` files or API keys, database passwords, Cloudinary secrets, JWT secrets or payment credentials to GitHub.

---

## 🔑 Authentication Flow

The application uses **JWT-based authentication**.

```text
User
  ↓
Signup / Login
  ↓
Backend Authentication
  ↓
JWT Token
  ↓
Local Storage
  ↓
Protected API Requests
```

Protected pages include:

* Profile
* Cart
* Wishlist
* Checkout
* Payment
* Orders

---

## 🛍️ Product Categories

The store currently supports:

* 👗 Ladies Suits
* ✨ Gowns
* 👚 Crop Tops
* 🌸 Indo-Western
* 👖 Palazzo

---

## 🗺️ Application Flow

```text
Home
 │
 ├── Categories
 │      └── Products
 │
 ├── Search
 │      └── Search Results
 │
 └── Product Details
          │
          ├── Wishlist
          │
          └── Add to Cart
                    │
                    ↓
                  Cart
                    │
                    ↓
                Checkout
                    │
                    ↓
                 Payment
                    │
                    ↓
               Order Success
                    │
                    ↓
                My Orders
```

---

## 📱 Responsive Design

The website is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

The UI follows a soft, modern fashion-inspired color palette with a clean shopping experience.

---

## 🔮 Future Enhancements

Planned improvements include:

* 🤖 AI-powered image product matching
* 💳 Complete Razorpay payment integration
* 📧 Automated order confirmation emails
* 👨‍💼 Admin dashboard
* 📦 Inventory management
* 🚚 Order delivery tracking
* ⭐ Product reviews and ratings
* 🔔 Order notifications
* 🧾 Invoice generation
* 🏷️ Coupons and discount system
* 📊 Sales analytics
* 👗 AI-powered outfit recommendations

---

## 📸 Screenshots

Screenshots can be added here after completing the UI:

```text
screenshots/
├── home.png
├── products.png
├── product-details.png
├── cart.png
├── checkout.png
└── orders.png
```

---

## 👩‍💻 Developer

**Ayushi Jain**

B.Tech Computer Science & Engineering Student

Interested in:

* Web Development
* MERN Stack
* Artificial Intelligence
* Machine Learning
* Data Structures & Algorithms

---

## 📄 License

This project is developed for educational and portfolio purposes.

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.
