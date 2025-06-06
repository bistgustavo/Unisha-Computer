# E-commerce Backend

This is the backend server for the E-commerce platform built with Node.js, Express, TypeScript, and Prisma.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - JavaScript with syntax for types
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Open source relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Zod** - TypeScript-first schema validation
- **Cloudinary** - Cloud-based image management
- **Multer** - Middleware for handling multipart/form-data

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database

## Getting Started

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add necessary environment variables:
   ```
   DATABASE_URL
   JWT_SECRET
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   PORT
   ```
5. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

## Available Scripts

- `npm run dev` - Starts the development server with hot-reload
- `npm start` - Starts the production server
- `npm test` - Runs tests (when implemented)

## Project Structure

```
Backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── index.ts       # Entry point
├── prisma/
│   └── schema.prisma  # Database schema
├── public/            # Static files
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and scripts
```

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### User Endpoints

- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- PUT /api/users/password - Change password

### Product Endpoints

- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin only)
- PUT /api/products/:id - Update product (admin only)
- DELETE /api/products/:id - Delete product (admin only)

### Order Endpoints

- GET /api/orders - Get user orders
- POST /api/orders - Create order
- GET /api/orders/:id - Get order by ID

## Database

The application uses PostgreSQL as its database and Prisma as the ORM. The database schema is defined in `prisma/schema.prisma`.

## Authentication

JWT (JSON Web Tokens) is used for authentication. Tokens are stored in HTTP-only cookies for security.

## File Upload

File uploads are handled using Multer middleware and stored in Cloudinary.

## Error Handling

The application includes centralized error handling and custom error classes.

## Data Validation

Input validation is performed using Zod schemas.

## Development

The application uses `nodemon` and `tsx` for development with hot-reload capability.

## Production Deployment

1. Build the TypeScript code:
   ```bash
   npm run build
   ```
2. Set up production environment variables
3. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
