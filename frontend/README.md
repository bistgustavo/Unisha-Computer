# E-commerce Frontend

This is the frontend application for the E-commerce platform built with React and Vite.

## Tech Stack

- **React** - A JavaScript library for building user interfaces
- **Vite** - Next Generation Frontend Tooling
- **React Router DOM** - Declarative routing for React
- **Axios** - Promise based HTTP client
- **Tailwind CSS** - A utility-first CSS framework
- **Styled Components** - CSS-in-JS styling solution
- **React Hot Toast** - Add beautiful notifications to your React app
- **React Icons** - Popular icons in your React projects

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Getting Started

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add necessary environment variables:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Locally preview production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
frontend/
├── src/              # Source files
├── public/           # Static files
├── index.html        # Entry HTML file
├── vite.config.js    # Vite configuration
├── package.json      # Project dependencies and scripts
└── eslint.config.js  # ESLint configuration
```

## Features

- Modern React with functional components and hooks
- Type-safe development environment
- Responsive design with Tailwind CSS
- Client-side routing with React Router
- Form validation
- Toast notifications
- API integration with Axios
- Password strength checking with zxcvbn

## Development

The application uses Vite for fast development and building. Hot Module Replacement (HMR) is enabled by default.

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate a `dist` directory with your compiled assets, ready for deployment.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
