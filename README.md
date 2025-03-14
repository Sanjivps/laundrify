# Laundrify

A modern React Native/Expo app for tracking washing machine availability in dormitories, built with TypeScript and Expo Router.

## Features

- View washing machines available on each floor
- Toggle machine status between "available" and "in use"
- Visual indicators for machine status
- TypeScript for type safety and better developer experience
- Expo Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/laundrify.git
cd laundrify
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Use the Expo Go app on your mobile device to scan the QR code, or run on a simulator

## Project Structure

- `app/` - Expo Router pages and layouts
  - `_layout.tsx` - Root layout component with navigation configuration
  - `index.tsx` - Home screen showing the list of floors
- `components/` - Reusable UI components
  - `FloorList.tsx` - Component to list all floors
  - `Floor.tsx` - Component to display a single floor
  - `WashingMachine.tsx` - Component to display washing machine status
- `data/` - Data files
  - `floors.ts` - Contains the floors and washing machines data with TypeScript types

## Technology Stack

- React Native
- Expo & Expo Router
- TypeScript
- React Hooks for state management

## License

MIT 