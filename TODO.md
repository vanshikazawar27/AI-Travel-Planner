# TODO - Authentication + Group Expense Splitter

## Backend (Express + MongoDB + JWT)
- [ ] Inspect current backend entry (`backend/server.js`) and routing.
- [ ] Add dependencies: `mongoose`, `jsonwebtoken`, `bcrypt`, `cookie-parser` (optional), `cors` already present.
- [ ] Create DB connection module.
- [ ] Add Mongoose models: `User`, `Group`, `Expense`.
- [ ] Add JWT middleware for protected routes.
- [ ] Implement auth routes: register, login, logout, `/me`.
- [ ] Implement group routes: create group, add member by email, list groups, get group details (authorized only).
- [ ] Implement expense routes: add expense with split, list expense history (authorized only).
- [ ] Add dashboard route computing totals: balance/owed/to-receive (authorized only).

## Frontend (React Native Expo)
- [ ] Create new Expo app folder at `reactnative/`.
- [ ] Implement React Navigation structure.
- [ ] Create `AuthContext` storing JWT via `AsyncStorage` and/or `expo-secure-store`.
- [ ] Implement `axios` API client that attaches JWT.
- [ ] Create screens: Register, Login, Dashboard, GroupList/GroupDetails, Expense screen.
- [ ] Secure routes based on auth state.
- [ ] Implement “each user sees only their own data” by relying on backend authorization.

## Verification
- [ ] Run backend locally and test via cURL/Postman.
- [ ] Run frontend and verify login/register, group creation, expense splitting, and totals.

