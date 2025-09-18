# Firebase Authentication System

This document describes the Firebase authentication system implemented in the Gov CSR Portal frontend.

## Features

- **Login Page** (`/login`) - User authentication with email and password
- **Signup Page** (`/signup`) - New user registration with comprehensive form validation
- **Protected Routes** - All main application routes require authentication
- **User Context** - Global authentication state management
- **Firebase Authentication** - Real authentication with Firebase Auth
- **Firestore Integration** - User data stored in Cloud Firestore
- **Real-time Auth State** - Automatic authentication state management

## Firebase Configuration

The app is configured with Firebase project: `gvt-csr`

- **Authentication:** Email/Password authentication
- **Database:** Cloud Firestore for user data storage
- **Analytics:** Firebase Analytics (optional)

## Components

### AuthContext (`src/contexts/AuthContext.jsx`)
- Manages global authentication state
- Provides login, signup, and logout functions
- Handles token storage and validation
- Redirects users based on authentication status

### Login Page (`src/pages/Login.jsx`)
- Email and password authentication
- Form validation with error messages
- Password visibility toggle
- Social login buttons (UI only)
- Remember me functionality
- Forgot password link

### Signup Page (`src/pages/Signup.jsx`)
- Comprehensive registration form
- Real-time password validation
- Role selection dropdown
- Terms and conditions agreement
- Form validation with detailed error messages

### Layout Component (`src/components/Layout.jsx`)
- User menu with profile information
- Logout functionality
- Dynamic user display based on auth state

## Authentication Flow

1. **Unauthenticated users** are redirected to `/login`
2. **Login/Signup** processes authenticate users and store tokens
3. **Authenticated users** can access all protected routes
4. **Logout** clears tokens and redirects to login

## Firebase Service (`src/services/authService.js`)

The application uses Firebase Authentication and Firestore:

- **Firebase Auth** for user authentication
- **Cloud Firestore** for storing user profile data
- **Real-time authentication state** management
- **Secure token handling** with Firebase
- **Error handling** with user-friendly messages

## Security Features

✅ **Production-ready security:**

1. **Firebase Authentication** - Industry-standard authentication
2. **Automatic password hashing** - Handled by Firebase
3. **Secure JWT tokens** - Firebase-managed tokens
4. **Firestore Security Rules** - Database-level security
5. **Real-time auth state** - Automatic session management
6. **Rate limiting** - Built into Firebase Auth
7. **Email verification** - Available through Firebase
8. **Password reset** - Available through Firebase

## Styling

The authentication pages use:
- Tailwind CSS for styling
- Custom gradient backgrounds
- Glass morphism effects
- Responsive design
- Smooth animations and transitions
- Form validation styling
- Loading states

## Usage

1. Start the development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Create a new account or sign in with existing credentials
4. Access protected routes after authentication
5. Use the user menu to logout

## Firebase Setup

1. **Enable Authentication** in Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider

2. **Set up Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules from `firestore.rules`

3. **Configure Security Rules**:
   - Copy rules from `firestore.rules` to Firebase Console
   - Deploy rules to secure your database

## File Structure

```
src/
├── firebase/
│   └── config.js               # Firebase configuration
├── contexts/
│   └── AuthContext.jsx         # Authentication context
├── pages/
│   ├── Login.jsx              # Login page
│   └── Signup.jsx             # Signup page
├── services/
│   └── authService.js         # Firebase authentication service
└── components/
    └── Layout.jsx             # Updated with auth features
```

## Additional Features Available

- **Email Verification** - Can be enabled in Firebase Console
- **Password Reset** - Can be implemented using Firebase Auth
- **Social Login** - Can be added (Google, Facebook, etc.)
- **Multi-factor Authentication** - Available through Firebase
- **User Management** - Admin panel for user management
