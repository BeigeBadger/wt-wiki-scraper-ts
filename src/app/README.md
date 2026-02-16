# App

Vite + React 19 frontend application.

## Environment Variables

```bash
VITE_GQL_ENDPOINT=http://localhost:4000/graphql
```

## Getting Started

```bash
cd src/app
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Aria (components)
- React Router DOM (routing)
- Apollo Client

## Project Structure

```
src/
├── main.tsx          # Entry point
├── App.tsx           # Main application with routes
├── index.css         # Tailwind imports
├── lib/
│   └── apollo.ts    # Apollo Client setup
├── components/       # React components
│   ├── Navbar.tsx
│   └── VehicleList.tsx
└── pages/            # Page components
    ├── Home.tsx
    ├── Vehicles.tsx
    └── LineUpBuilder.tsx
```
