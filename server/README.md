# 🎮 Invoke Backend API

A robust REST API for managing tabletop RPG gaming communities, built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

- **User Management**: Registration, profiles, roles (admin/user), DM status
- **Game Management**: RPG game catalog with genres and systems
- **Session Management**: Gaming sessions with scheduling and player management
- **Campaign Management**: Long-term campaigns with multiple sessions
- **Feedback System**: Player ratings and reviews for sessions and DMs
- **Validation**: Comprehensive input validation with Joi
- **Error Handling**: Robust error handling and logging
- **Database Seeding**: Sample data for development and testing

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Validation**: Joi
- **Security**: Helmet
- **Logging**: Winston
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (Atlas account)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoke/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## ⚙️ Configuration

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoke_db?retryWrites=true&w=majority

# JWT Configuration (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Update your `.env` file with the connection string


### Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 5 users (1 admin, 4 regular users)
- 5 popular RPG games
- 4 gaming sessions
- 3 campaigns
- 5 feedback entries

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```


### Users
```http
GET    /users          # Get all users
POST   /users          # Create user
GET    /users/:id      # Get user by ID
PUT    /users/:id      # Update user
DELETE /users/:id      # Delete user
```

### Games
```http
GET    /games          # Get all games
POST   /games          # Create game
GET    /games/:id      # Get game by ID
PUT    /games/:id      # Update game
DELETE /games/:id      # Delete game
```

### Sessions
```http
GET    /sessions       # Get all sessions
POST   /sessions       # Create session
GET    /sessions/:id   # Get session by ID
PUT    /sessions/:id   # Update session
DELETE /sessions/:id   # Delete session
```

### Campaigns
```http
GET    /campaigns      # Get all campaigns
POST   /campaigns      # Create campaign
GET    /campaigns/:id  # Get campaign by ID
PUT    /campaigns/:id  # Update campaign
DELETE /campaigns/:id  # Delete campaign
```

### Feedback
```http
GET    /feedback       # Get all feedback
POST   /feedback       # Create feedback
GET    /feedback/:id   # Get feedback by ID
PUT    /feedback/:id   # Update feedback
DELETE /feedback/:id   # Delete feedback
```

## 🧪 Testing

### Insomnia Collection

Import the provided `Insomnia_Collection.json` file into Insomnia for easy API testing.

### Manual Testing

1. Start the server:
   ```bash
   npm run dev
   ```

2. Test endpoints using curl or any API client:
   ```bash
     # Get all users
   curl http://localhost:3000/api/v1/users
   ```

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── app.config.js      # Express app configuration
│   │   ├── database.config.js # Database connection
│   │   └── dotenv.config.js   # Environment variables
│   ├── middlewares/
│   │   ├── logger.middleware.js # Request logging
│   │   └── validate.js        # Joi validation middleware
│   ├── resources/
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.model.js
│   │   │   ├── user.route.js
│   │   │   ├── user.validation.js
│   │   │   └── user.enum.js
│   │   ├── game/
│   │   ├── session/
│   │   ├── campaign/
│   │   └── feedback/
│   └── seeders/
│       ├── index.js
│       ├── userSeeder.js
│       ├── gameSeeder.js
│       ├── sessionSeeder.js
│       ├── campaignSeeder.js
│       ├── feedbackSeeder.js
│       └── testSeeder.js
├── package.json
└── README.md
```

## 🚀 Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
npm run build    # Install dependencies
```

### Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make changes** to your code

3. **Test endpoints** using Insomnia or curl

4. **Seed database** when needed:
   ```bash
   npm run seed
   ```

### Code Style

- Use ES6+ features
- Follow Express.js best practices
- Use async/await for database operations
- Implement proper error handling
- Add validation for all inputs

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | `default-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `NODE_ENV` | Environment | `development` |

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your MongoDB connection string
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Validation Errors**
   - Check request body format
   - Ensure all required fields are present
   - Verify data types match schema

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process on port 3000

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for the RPG community**
