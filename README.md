# Backend (Node.js/Express)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your credentials.
3. Start the server:
   ```bash
   npm run dev
   ```

## Features
- User authentication (Google, OTP)
- Live stream requests and management
- Wallet and rewards system
- Admin endpoints

## Folder Structure
- `src/models` - Mongoose schemas
- `src/controllers` - Business logic
- `src/routes` - Express routers
- `src/middlewares` - Auth, error handling
- `src/utils` - Helpers (OTP, email, etc.) #   h  
 