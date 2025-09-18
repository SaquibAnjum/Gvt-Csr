# Firebase Setup Guide

This guide will help you set up Firebase Authentication for your Gov CSR Portal.

## Step 1: Firebase Console Setup

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** (if not already created):
   - Project name: `gvt-csr`
   - Enable Google Analytics (optional)
   - Choose your region

3. **Add a web app**:
   - Click "Add app" → Web icon
   - App nickname: `Gov CSR Portal`
   - Check "Also set up Firebase Hosting" (optional)
   - Register app

4. **Copy the configuration**:
   - The config should match what's in `src/firebase/config.js`
   - If different, update the config file

## Step 2: Enable Authentication

1. **Go to Authentication** in the left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Email/Password"**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Set up Firestore Database

1. **Go to Firestore Database** in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in production mode"**
4. **Select your region**
5. **Click "Done"**

## Step 4: Configure Security Rules

1. **Go to Firestore Database → Rules**
2. **Replace the default rules** with the content from `firestore.rules`
3. **Click "Publish"**

## Step 5: Test the Setup

1. **Start your development server**: `npm run dev`
2. **Go to `/login`**
3. **Check the Firebase Test component** for connection status
4. **Try creating a new account** at `/signup`
5. **Try logging in** with the created account

## Troubleshooting

### Common Issues:

1. **"Authentication failed" error**:
   - Check if Authentication is enabled in Firebase Console
   - Verify Email/Password sign-in method is enabled
   - Check browser console for detailed error messages

2. **"Project not found" error**:
   - Verify the project ID in `src/firebase/config.js`
   - Make sure the Firebase project exists
   - Check if the project is active

3. **"Configuration not found" error**:
   - Verify all config values are correct
   - Make sure the web app is properly registered
   - Check if the API key is valid

4. **Firestore permission denied**:
   - Check if Firestore is enabled
   - Verify security rules are deployed
   - Make sure the user is authenticated

### Debug Steps:

1. **Check browser console** for detailed error messages
2. **Use the Firebase Test component** to verify connection
3. **Check Firebase Console** for any error logs
4. **Verify all configuration values** match Firebase Console

## Fallback Authentication

If Firebase setup is not complete, the app will automatically use fallback authentication with demo users:

- **Admin**: `admin@govcsr.com` / `admin123`
- **Coordinator**: `coordinator@govcsr.com` / `coordinator123`

## Production Considerations

1. **Update security rules** for production
2. **Enable email verification** if needed
3. **Set up proper user roles** and permissions
4. **Configure rate limiting** and security policies
5. **Set up monitoring** and alerts
6. **Backup user data** regularly

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Firebase Console configuration
3. Test with the Firebase Test component
4. Check the troubleshooting section above
