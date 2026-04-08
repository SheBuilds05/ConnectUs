Here's a comprehensive `README.md` file for your ConnectUs backend:

## `README.md`

```markdown
# ConnectUs Backend API

Backend server for the ConnectUs Runner Dashboard application. Provides RESTful APIs for user authentication, order management, earnings tracking, and reviews.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Programming language
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # Database configuration
│   ├── controllers/
│   │   ├── authController.ts   # Authentication logic
│   │   ├── orderController.ts  # Order management logic
│   │   ├── userController.ts   # User profile logic
│   │   └── earningsController.ts # Earnings logic
│   ├── middleware/
│   │   └── authMiddleware.ts    # JWT authentication middleware
│   ├── models/
│   │   ├── User.ts              # User data models
│   │   ├── Order.ts             # Order data models
│   │   ├── Review.ts            # Review data models
│   │   └── Earnings.ts          # Earnings data models
│   ├── routes/
│   │   ├── authRoutes.ts        # Authentication routes
│   │   ├── orderRoutes.ts       # Order routes
│   │   ├── userRoutes.ts        # User routes
│   │   └── earningsRoutes.ts    # Earnings routes
│   ├── utils/
│   │   └── generateToken.ts     # JWT token utilities
│   └── server.ts                 # Main application entry
├── .env                          # Environment variables
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Documentation
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=connectus
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb connectus
   
   # Run the schema
   psql -d connectus -f database.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | No |
| GET | `/me` | Get current user info | Yes |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/available` | Get available orders | Yes |
| GET | `/active` | Get active orders for runner | Yes |
| GET | `/completed` | Get completed orders | Yes |
| GET | `/:id` | Get order by ID | Yes |
| POST | `/:id/accept` | Accept an order | Yes |
| PATCH | `/:id/status` | Update order status | Yes |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| GET | `/reviews` | Get user reviews | Yes |
| GET | `/stats` | Get user statistics | Yes |

### Earnings Routes (`/api/earnings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get earnings summary and transactions | Yes |
| GET | `/history` | Get earnings history for charts | Yes |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📦 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'runner',
    avatar_url TEXT,
    is_online BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    total_trips INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    restaurant_name VARCHAR(255) NOT NULL,
    restaurant_address TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone VARCHAR(20),
    items TEXT[] NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    distance DECIMAL(5,2) NOT NULL,
    estimated_time INTEGER NOT NULL,
    payout DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    assigned_to INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing the API

### Test if server is running
```bash
curl http://localhost:5000/api/health
```

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Deploy to Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables
5. Deploy!

### Deploy to Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | connectus |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration | 7d |
| NODE_ENV | Environment | development |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Express.js team
- PostgreSQL team
- All contributors

## 📞 Support

For support, email support@connectus.com or open an issue in the repository.
```

This README provides:
- ✅ Project overview
- ✅ Tech stack
- ✅ Folder structure
- ✅ Installation instructions
- ✅ API endpoint documentation
- ✅ Database schema
- ✅ Testing examples
- ✅ Deployment guides
- ✅ Environment variables
- ✅ Contributing guidelines