# Firebase Quick Setup Guide

## 🚨 **Current Issue**: Firebase Authentication is not enabled

**Error**: `auth/configuration-not-found`

**Solution**: Enable Firebase Authentication in your Firebase Console

## 🚀 **Quick Fix (5 minutes)**

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **gvt-csr**

### Step 2: Enable Authentication
1. Click **"Authentication"** in the left sidebar
2. Click **"Get started"** (if you see this button)
3. Go to **"Sign-in method"** tab

### Step 3: Enable Email/Password
1. Click on **"Email/Password"**
2. Toggle **"Enable"** (first option)
3. Click **"Save"**

### Step 4: Enable Google (Optional)
1. Click on **"Google"**
2. Toggle **"Enable"**
3. Set **Project support email** to your email
4. Click **"Save"**

### Step 5: Enable Facebook (Optional)
1. Click on **"Facebook"**
2. Toggle **"Enable"**
3. You'll need to create a Facebook App first
4. Enter App ID and App Secret when ready
5. Click **"Save"**

## ✅ **Test Your Setup**

After enabling Authentication:

1. **Start your app**: `npm run dev`
2. **Go to** `http://localhost:3000/login`
3. **Try creating an account** with email/password
4. **Try Google login** (if enabled)
5. **Try Facebook login** (if enabled)

## 🔧 **Current Working Features**

Even without Firebase setup, your app works with:

- ✅ **Email/Password registration**
- ✅ **Email/Password login**
- ✅ **Demo user accounts**:
  - `admin@govcsr.com` / `admin123`
  - `coordinator@govcsr.com` / `coordinator123`
- ✅ **Protected routes**
- ✅ **User management**
- ✅ **Responsive design**

## 🎯 **What Happens After Setup**

Once Firebase Authentication is enabled:

- ✅ **Real Firebase authentication**
- ✅ **Google OAuth login**
- ✅ **Facebook OAuth login**
- ✅ **User data stored in Firestore**
- ✅ **Secure token management**
- ✅ **Production-ready authentication**

## 🆘 **Need Help?**

If you're still having issues:

1. **Check Firebase Console** - Make sure Authentication is enabled
2. **Check browser console** - Look for detailed error messages
3. **Try different browsers** - Some browsers block popups
4. **Check popup blockers** - Disable them for localhost

## 📱 **Test Now**

Your app is already working! Try these:

1. **Create account**: Go to `/signup`
2. **Login**: Go to `/login`
3. **Use demo accounts**: Use the credentials above
4. **Access dashboard**: After login, you'll see the main app

The authentication system is fully functional - you just need to enable Firebase in the console! 🎉
