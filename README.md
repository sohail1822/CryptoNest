# 🦅 CryptoNest

CryptoNest is a premium, full-stack cryptocurrency tracking and portfolio management platform. It provides real-time market data, historical charts, news insights, and a virtual trading environment for users to manage their digital assets.

![CryptoNest Banner](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

- **Live Market Tracking**: Real-time price updates and market stats for thousands of cryptocurrencies via CoinGecko.
- **Portfolio Management**: Buy and sell virtual assets with a starting credit of ₹1,000,000.
- **Interactive Charts**: 7-day historical price trends visualized with Recharts.
- **Crypto Intelligence**: Sentiment analysis (Fear & Greed Index) and global market overview.
- **Watchlist**: Track your favorite coins in a personalized list.
- **Latest News**: Stay updated with the latest crypto news powered by NewsData.io.
- **Enterprise Design**: A stunning, high-performance UI with professional Dark and Light modes.
- **Secure Authentication**: JWT-based secure login and signup system.

## 🚀 Tech Stack

### Frontend
- **React.js**: Functional components with Hooks.
- **Tailwind CSS**: Modern utility-first styling.
- **Framer Motion**: Smooth micro-animations and transitions.
- **Recharts**: Data visualization for price history.
- **Axios**: API communication.
- **React Context API**: Global state management (Auth, Theme, Watchlist).

### Backend
- **Node.js & Express**: Scalable server architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database with optimized schema modeling.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Axios**: Server-side proxying for third-party APIs.
- **CoinGecko API**: Integrated with a robust caching layer and retry logic to avoid rate limits.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CryptoNest.git
cd CryptoNest
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_random_secret_key
COINGECKO_API_KEY=your_coingecko_demo_key
NODE_ENV=development
DEV_CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_NEWSDATA_API_KEY=your_newsdata_api_key
```

### 4. Running the App
**Start Backend:**
```bash
cd backend
npm run dev
```
**Start Frontend:**
```bash
cd frontend
npm start
```

## 📈 Optimization & Architecture

- **Caching Layer**: The backend implements a MongoDB-based caching system for CoinGecko API calls, reducing external hits and improving performance.
- **Retry Mechanism**: Implemented exponential backoff for API calls to gracefully handle `429 Too Many Requests` errors.
- **Security**: Passwords are encrypted using `bcryptjs`, and all sensitive routes are protected by an `auth` middleware.

## 📄 License
This project is licensed under the MIT License.
