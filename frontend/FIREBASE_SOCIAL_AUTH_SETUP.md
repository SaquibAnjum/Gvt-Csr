# Firebase Social Authentication Setup Guide

This guide will help you set up Google and Facebook authentication with Firebase for your Gov CSR Portal.

## Prerequisites

- Firebase project created
- Firebase Authentication enabled
- Google Cloud Console access
- Facebook Developer account

## Step 1: Firebase Console Setup

### 1.1 Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gvt-csr`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Enable **Google** provider
6. Enable **Facebook** provider

### 1.2 Configure Google Authentication
1. In **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Set **Project support email** to your email
5. Click **Save**

### 1.3 Configure Facebook Authentication
1. In **Authentication** → **Sign-in method**
2. Click on **Facebook** provider
3. Toggle **Enable**
4. You'll need Facebook App ID and App Secret (see Step 2)
5. Click **Save**

## Step 2: Google Cloud Console Setup

### 2.1 Create OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project: `gvt-csr`
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Copy the **Client ID** and **Client Secret**

### 2.2 Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and **Enable**

## Step 3: Facebook Developer Setup

### 3.1 Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** app type
4. Fill in app details:
   - **App Name**: Gov CSR Portal
   - **App Contact Email**: your email
   - **App Purpose**: Business
5. Click **Create App**

### 3.2 Configure Facebook Login
1. In your Facebook App dashboard
2. Go to **Products** → **Facebook Login** → **Settings**
3. Add Valid OAuth Redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. Go to **Settings** → **Basic**
5. Copy **App ID** and **App Secret**

### 3.3 Add Facebook Login Product
1. In your Facebook App dashboard
2. Go to **Products** → **Add Product**
3. Find **Facebook Login** and click **Set Up**
4. Choose **Web** platform
5. Enter your site URL: `http://localhost:3000`

## Step 4: Update Firebase Configuration

### 4.1 Update Firebase Console
1. Go back to Firebase Console
2. **Authentication** → **Sign-in method** → **Facebook**
3. Enter your Facebook **App ID** and **App Secret**
4. Click **Save**

### 4.2 Verify Configuration
Your Firebase config should match:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4",
  authDomain: "gvt-csr.firebaseapp.com",
  projectId: "gvt-csr",
  storageBucket: "gvt-csr.firebasestorage.app",
  messagingSenderId: "180347096706",
  appId: "1:180347096706:web:14d363864b2815ef3c6e9b",
  measurementId: "G-N487Y0XMYX"
};
```

## Step 5: Set up Firestore Database

### 5.1 Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your region
5. Click **Done**

### 5.2 Deploy Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace with the rules from `firestore.rules`
3. Click **Publish**

## Step 6: Test the Setup

### 6.1 Start Development Server
```bash
npm run dev
```

### 6.2 Test Authentication Methods
1. **Email/Password**: Create account and login
2. **Google**: Click Google button and test OAuth flow
3. **Facebook**: Click Facebook button and test OAuth flow

### 6.3 Check Firestore
1. Go to **Firestore Database** → **Data**
2. Verify user documents are created in `users` collection
3. Check that user data includes provider information

## Troubleshooting

### Common Issues:

#### Google Authentication Issues:
- **"popup_closed_by_user"**: User closed the popup
- **"popup_blocked"**: Browser blocked the popup
- **"invalid_client"**: Wrong OAuth client configuration
- **"redirect_uri_mismatch"**: Redirect URI doesn't match

#### Facebook Authentication Issues:
- **"popup_closed_by_user"**: User closed the popup
- **"popup_blocked"**: Browser blocked the popup
- **"invalid_app_id"**: Wrong Facebook App ID
- **"redirect_uri_mismatch"**: Redirect URI doesn't match

#### General Issues:
- **"auth/operation-not-allowed"**: Provider not enabled in Firebase
- **"auth/configuration-not-found"**: Firebase config issue
- **"auth/network-request-failed"**: Network connectivity issue

### Debug Steps:
1. Check browser console for detailed error messages
2. Verify Firebase Console configuration
3. Check Google Cloud Console OAuth settings
4. Verify Facebook App configuration
5. Test with different browsers
6. Check popup blockers

## Production Deployment

### 1. Update Redirect URIs
- Add your production domain to Google OAuth
- Add your production domain to Facebook App
- Update Firebase authorized domains

### 2. Security Considerations
- Use environment variables for sensitive data
- Implement proper CORS policies
- Set up monitoring and alerts
- Regular security audits

### 3. User Data Management
- Implement user role management
- Set up data retention policies
- Regular backup of user data
- GDPR compliance considerations

## Features Implemented

✅ **Email/Password Authentication**
✅ **Google OAuth Authentication**
✅ **Facebook OAuth Authentication**
✅ **User Profile Management**
✅ **Firestore Integration**
✅ **Error Handling**
✅ **Loading States**
✅ **Responsive Design**

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all configurations match this guide
3. Test with different browsers
4. Check Firebase Console logs
5. Review Google Cloud Console logs
6. Check Facebook App logs

Your authentication system is now fully functional with Google and Facebook integration! 🎉
