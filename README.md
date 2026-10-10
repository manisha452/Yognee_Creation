# 🌸 Yognee Creation — Girls Fashion eCommerce (MERN Stack)

A **production-ready, fully dynamic** girls fashion eCommerce platform built with the MERN stack. Features real-time dynamic categories, Razorpay payments, Cloudinary image uploads, JWT auth, and a full admin dashboard.

---

## ✨ Features

### 🛍️ Customer Storefront
| Feature | Details |
|---|---|
| Home Page | Hero banner, dynamic category grid, featured products, new arrivals, best sellers |
| Collection Page | Filter by category/price/size/season, sort, search, pagination |
| Product Page | Image gallery, size/color selector, reviews, related products |
| Cart | Persistent cart, quantity controls, shipping/tax calculation |
| Wishlist | Toggle wishlist, persisted per user |
| Checkout | 3-step checkout: Address → Payment → Confirm |
| Orders | Order history, real-time tracking timeline |
| Profile | Update info, change password, manage addresses |
| Search | Full-text search across name, description, tags |

### 💳 Payment Methods
- **Razorpay** — UPI, PhonePe, Paytm, GPay, Credit/Debit Cards, Net Banking
- **Cash on Delivery (COD)**

### ⚙️ Admin Dashboard
| Feature | Details |
|---|---|
| Dashboard | Revenue, orders, products, users stats + monthly chart |
| Products | Add/Edit/Delete with Cloudinary image upload, toggle active/featured |
| Categories | **Fully dynamic** — add a category, it auto-appears everywhere on the site |
| Orders | View all orders, update status, add tracking number |
| Users | View all customers, block/unblock accounts |

### 🔥 Dynamic Category System
When admin adds a new category:
- ✅ Navbar menu updates automatically
- ✅ Collection page filter tabs update automatically
- ✅ Homepage category grid updates automatically
- ✅ No frontend code changes needed

---

## 🏗️ Tech Stack

```
Frontend:  React 18, Tailwind CSS, React Router v6, Axios, React Hot Toast
Backend:   Node.js, Express.js, MongoDB, Mongoose
Auth:      JWT (JSON Web Tokens), bcryptjs
Images:    Cloudinary (upload, transform, delete)
Payments:  Razorpay (UPI, Cards, COD)
Fonts:     Playfair Display, DM Sans, Cormorant Garamond
```

---

## 📁 Project Structure

```
yogneeCreation/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary + Multer config
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── productController.js   # Product CRUD + filters
│   │   ├── categoryController.js  # Category CRUD
│   │   ├── cartController.js      # Cart operations
│   │   ├── wishlistController.js  # Wishlist toggle
│   │   ├── orderController.js     # Order + Razorpay
│   │   ├── reviewController.js    # Product reviews
│   │   └── adminController.js     # Dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.js      # protect, admin, optionalAuth
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js             # With embedded reviews
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Order.js               # With status history
│   ├── routes/                    # All route files
│   ├── utils/
│   │   └── seeder.js              # Seed demo data
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── ProductCard.js   # Card with wishlist, add to cart
    │   │   │   ├── ProtectedRoute.js
    │   │   │   └── AdminRoute.js
    │   │   └── layout/
    │   │       ├── Navbar.js        # Responsive, sticky, dynamic categories
    │   │       └── Footer.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   ├── CartContext.js
    │   │   └── WishlistContext.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── CollectionPage.js    # Filter + Sort + Search
    │   │   ├── ProductPage.js       # Full product detail + reviews
    │   │   ├── CartPage.js
    │   │   ├── WishlistPage.js
    │   │   ├── CheckoutPage.js      # Razorpay integration
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── OrdersPage.js
    │   │   ├── OrderDetailPage.js
    │   │   ├── ProfilePage.js
    │   │   └── admin/
    │   │       ├── AdminLayout.js
    │   │       ├── AdminDashboard.js
    │   │       ├── AdminProducts.js
    │   │       ├── AdminProductForm.js  # Full product editor + image upload
    │   │       ├── AdminCategories.js   # Dynamic category manager
    │   │       ├── AdminOrders.js
    │   │       └── AdminUsers.js
    │   ├── utils/
    │   │   └── api.js              # All Axios API calls
    │   ├── App.js
    │   └── index.css               # Tailwind + custom styles
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)
- Razorpay account (test mode available)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/zuri-fashion.git
cd zuri-fashion
npm run install:all
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/yogneeCreation

# Generate a strong secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this

# Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Get from https://dashboard.razorpay.com (use test keys for dev)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

NODE_ENV=development
```

### 3. Seed Demo Data

```bash
npm run seed
```

This creates:
- 8 product categories
- 12 sample products across all categories

### 4. Run Development Servers

```bash
# From project root — starts both backend (5000) and frontend (3000)
npm run dev

# Or separately:
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
```

Open **http://localhost:3000** in your browser.

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| PUT | `/api/auth/password` | ✅ | Change password |
| POST | `/api/auth/address` | ✅ | Add address |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | Get products (with filters) |
| GET | `/api/products/:slug` | ❌ | Get single product |
| GET | `/api/products/:id/related` | ❌ | Related products |
| POST | `/api/products` | 🔑 Admin | Create product |
| PUT | `/api/products/:id` | 🔑 Admin | Update product |
| DELETE | `/api/products/:id` | 🔑 Admin | Delete product |

**Query Params for GET /api/products:**
```
?category=short-kurti
?search=floral
?sort=price_asc | price_desc | newest | rating | popular
?minPrice=500&maxPrice=2000
?size=M,L
?season=summer
?featured=true
?newArrival=true
?bestSeller=true
?page=1&limit=12
```

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | ❌ | Get all active categories |
| GET | `/api/categories/:slug` | ❌ | Get category by slug |
| POST | `/api/categories` | 🔑 Admin | Create category |
| PUT | `/api/categories/:id` | 🔑 Admin | Update category |
| DELETE | `/api/categories/:id` | 🔑 Admin | Delete category |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ✅ | Get user cart |
| POST | `/api/cart/add` | ✅ | Add item to cart |
| PUT | `/api/cart/item/:itemId` | ✅ | Update quantity |
| DELETE | `/api/cart/item/:itemId` | ✅ | Remove item |
| DELETE | `/api/cart/clear` | ✅ | Clear cart |

### Orders & Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ✅ | Place order |
| GET | `/api/orders/my` | ✅ | My orders |
| GET | `/api/orders/:id` | ✅ | Order detail |
| POST | `/api/orders/razorpay/create` | ✅ | Create Razorpay order |
| POST | `/api/orders/razorpay/verify` | ✅ | Verify payment |
| GET | `/api/orders/admin/all` | 🔑 Admin | All orders |
| PUT | `/api/orders/:id/status` | 🔑 Admin | Update status |

### Image Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/image` | 🔑 Admin | Upload single image |
| POST | `/api/upload/images` | 🔑 Admin | Upload multiple images |
| DELETE | `/api/upload/image` | 🔑 Admin | Delete image from Cloudinary |

---

## 💳 Razorpay Payment Flow

```
1. Customer clicks "Pay ₹XXXX"
2. Backend creates Razorpay order via API
3. Our order saved to DB with status "pending"
4. Razorpay checkout opens (UPI/Card/Paytm etc.)
5. Customer pays → Razorpay calls handler
6. Backend verifies HMAC signature
7. Order marked as "paid" + "confirmed"
8. Cart cleared, user redirected to order page
```

**Test UPI for Razorpay:**
- UPI: `success@razorpay`
- Card: `4111 1111 1111 1111`, any future date, any CVV

---

## ☁️ Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `backend/.env`
4. Images are automatically:
   - Resized to max 800×1000px
   - Quality auto-optimized
   - Stored in `zuri_fashion/` folder

---

## 🐳 Docker Deployment

```bash
# Copy and fill env values
cp backend/.env.example .env

# Build and start all services
docker-compose up -d

# Seed data
docker exec zuri_backend node utils/seeder.js

# Stop
docker-compose down
```

---

## 🔒 Security Features

- ✅ JWT tokens with expiry
- ✅ Passwords hashed with bcryptjs (12 rounds)
- ✅ Razorpay HMAC signature verification
- ✅ Admin-only route guards (frontend + backend)
- ✅ MongoDB input sanitization via Mongoose validators
- ✅ CORS configured for specific origins
- ✅ File type validation on image uploads
- ✅ Rate-limiting ready (add `express-rate-limit` for production)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Rose-600 `#e11d48` |
| Accent | Gold `#D4AF37` |
| Nude | `#F5E6D3` |
| Font Display | Playfair Display (serif) |
| Font Body | DM Sans (sans-serif) |
| Font Accent | Cormorant Garamond |
| Border Radius | `rounded-2xl` (16px) |
| Shadows | `shadow-sm`, `shadow-lg` |

---

## 📦 Default Categories (Seeded)

| Icon | Name | Slug | Season |
|------|------|------|--------|
| 👗 | Short Kurti | `short-kurti` | All |
| 🥻 | Long Kurti | `long-kurti` | All |
| ✨ | Suits | `suits` | All |
| 👚 | Tops | `tops` | All |
| 👖 | Bottomwear | `bottomwear` | All |
| 💎 | Accessories | `accessories` | All |
| ☀️ | Summer Collection | `summer-collection` | Summer |
| ❄️ | Winter Collection | `winter-collection` | Winter |

---

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Use a strong `JWT_SECRET` (64+ random chars)
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Switch Razorpay from test keys to live keys
- [ ] Enable MongoDB Atlas with strong password + IP whitelist
- [ ] Set up HTTPS (Let's Encrypt / Cloudflare)
- [ ] Add `express-rate-limit` for API protection
- [ ] Configure Cloudinary upload presets for stricter control

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

**Built with ❤️ in Rajasthan, India 🇮🇳**
