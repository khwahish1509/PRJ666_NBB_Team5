# DermoScanners - Your Intelligent Skin Health Companion

DermoScanners is a comprehensive web application that combines AI-powered skin lesion analysis with intelligent skincare product recommendations, helping users make informed decisions about their skin health.

## ✨ Key Features

### 🔬 AI Skin Analysis
- Upload skin lesion images for instant AI analysis
- Get confidence scores and risk classifications
- Receive personalized health recommendations
- Track scan history with automatic cloud sync

### 💡 Smart Product Recommendations
- Personalized suggestions based on your skin type
- Advanced filtering (skin type, price, category)
- Comprehensive safety ratings
- Ingredient analysis and reviews

### 📊 Product Comparison
- Compare up to 3 products side-by-side
- View ratings, prices, and safety scores
- Identify best value automatically
- Make informed purchasing decisions

### 🔒 Secure & Private
- JWT-based authentication
- Encrypted data storage
- Cloud synchronization with MongoDB Atlas
- Backup and restore functionality

### 📱 Fully Responsive
- Optimized for mobile, tablet, and desktop
- Progressive Web App capabilities
- Offline-first architecture
- Fast and intuitive interface

## Project Structure

```
PRJ666_NBB_Team5/
├── dermoscanners/
│   ├── client/          # React frontend (Vite)
│   ├── server/          # Express backend (Node.js)
│   └── package.json     # Workspace configuration
├── render.yaml          # Deployment configuration
└── docs/                # Documentation
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (for cloud database)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PRJ666_NBB_Team5
   ```

2. **Install dependencies**
   ```bash
   cd dermoscanners
   npm install
   ```

3. **Configure environment variables**
   
   Backend (dermoscanners/server/.env):
   ```bash
   cp dermoscanners/server/.env.example dermoscanners/server/.env
   # Edit .env with your MongoDB URI and secrets
   ```
   
   Frontend (dermoscanners/client/.env):
   ```bash
   cp dermoscanners/client/.env.example dermoscanners/client/.env
   # Edit .env with your API URL
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## Deployment

### Quick Deploy to Render

See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for a condensed deployment guide.

### Detailed Deployment

1. **Preparation**
   - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive instructions
   - Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to track progress

2. **Deploy Backend**
   - Create Web Service on Render
   - Configure environment variables
   - Deploy from GitHub

3. **Deploy Frontend**
   - Create Static Site on Render
   - Configure API URL
   - Deploy from GitHub

4. **Verify Deployment**
   ```bash
   node verify-deployment.js <backend-url> <frontend-url>
   ```

## 📚 Documentation

### For Users
- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get started in 5 minutes
- **[User Guide](dermoscanners/USER_GUIDE.md)** - Complete feature walkthrough
- **[FAQ](dermoscanners/FAQ.md)** - Common questions answered

### For Developers
- **[Developer Guide](DEVELOPER_GUIDE.md)** - Development setup and guidelines
- **[API Documentation](dermoscanners/server/TESTING_GUIDE.md)** - API endpoints and testing
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment
- **[Quick Deploy](QUICK_DEPLOY.md)** - Fast deployment reference

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- Helmet (security)

### Deployment
- Render (hosting)
- MongoDB Atlas (database)
- GitHub (version control)

## Scripts

### Root Level (dermoscanners/)
```bash
npm run dev          # Start both client and server in development mode
npm run build        # Build client for production
npm start            # Start server in production mode
```

### Server (dermoscanners/server/)
```bash
npm run dev          # Start server with nodemon
npm start            # Start server in production
npm test             # Run tests
npm run seed         # Seed database with sample data
```

### Client (dermoscanners/client/)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5001
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api
```

See `.env.example` files for complete documentation.

## Testing

```bash
# Run backend tests
cd dermoscanners/server
npm test

# Verify deployment
node verify-deployment.js <backend-url> <frontend-url>
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Team

PRJ666 - NBB Team 5

## License

This project is for educational purposes as part of PRJ666 course.
