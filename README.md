# Joby Frontend

Angular-based job portal frontend application for the Joby platform.

## Features

- User authentication (login/register)
- Job search and filtering
- Job applications
- User profiles
- Recruiter dashboard
- Responsive design with Bootstrap

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Navigate to `http://localhost:4200/`

## Backend Configuration

The application expects the backend to be running at `http://localhost:8080`. You can modify this in `src/environments/environment.ts`.

## Project Structure

```
src/
├── app/
│   ├── components/      # UI components
│   ├── services/        # API services
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   ├── model/           # Data models
│   └── app.routes.ts    # Route configuration
├── assets/              # Static assets
└── environments/        # Environment configs
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests

## Technologies Used

- Angular 17
- Bootstrap 5
- RxJS
- TypeScript
