// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4",
  authDomain: "gvt-csr.firebaseapp.com",
  projectId: "gvt-csr",
  storageBucket: "gvt-csr.appspot.com",
  messagingSenderId: "180347096706",
  appId: "1:180347096706:web:14d363864b2815ef3c6e9b",
  measurementId: "G-N487Y0XMYX"
};

// Debug logging for Firebase configuration
console.log('🔧 FIREBASE CONFIG DEBUG:');
console.log('=====================================');
console.log('📋 Configuration Object:', firebaseConfig);
console.log('🔑 API Key:', firebaseConfig.apiKey);
console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
console.log('📦 Project ID:', firebaseConfig.projectId);
console.log('💾 Storage Bucket:', firebaseConfig.storageBucket);
console.log('📱 App ID:', firebaseConfig.appId);
console.log('📊 Measurement ID:', firebaseConfig.measurementId);
console.log('=====================================');

// Initialize Firebase
console.log('🚀 Initializing Firebase...');
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  console.log('📱 App name:', app.name);
  console.log('⚙️ App options:', app.options);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
console.log('🔐 Initializing Firebase Authentication...');
let auth;
try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
  console.log('🔐 Auth app:', auth.app);
  console.log('🔐 Auth config:', auth.config);
  console.log('🔐 Auth current user:', auth.currentUser);
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error);
  throw error;
}

// Initialize Cloud Firestore and get a reference to the service
console.log('💾 Initializing Firestore...');
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  console.log('💾 DB app:', db.app);
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

// Initialize Analytics (optional)
console.log('📊 Initializing Analytics...');
let analytics;
try {
  analytics = getAnalytics(app);
  console.log('✅ Analytics initialized successfully');
} catch (error) {
  console.warn('⚠️ Analytics initialization failed (optional):', error);
}

// Initialize Auth Providers
console.log('🔑 Initializing Auth Providers...');
let googleProvider, facebookProvider;
try {
  googleProvider = new GoogleAuthProvider();
  console.log('✅ Google Provider created');
  
  facebookProvider = new FacebookAuthProvider();
  console.log('✅ Facebook Provider created');
  
  // Configure Google provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  console.log('⚙️ Google Provider configured');
  
  // Configure Facebook provider
  facebookProvider.setCustomParameters({
    display: 'popup'
  });
  console.log('⚙️ Facebook Provider configured');
  
} catch (error) {
  console.error('❌ Auth Providers initialization failed:', error);
  throw error;
}

console.log('🎉 Firebase initialization complete!');
console.log('=====================================');

export { auth, db, analytics, googleProvider, facebookProvider };
export default app;
