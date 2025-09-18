// Hybrid authentication service - Firebase with fallback
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider } from '../firebase/config'

// Fallback demo users for testing
const DEMO_USERS = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@govcsr.com',
    password: 'admin123',
    phone: '+1234567890',
    organization: 'Government CSR Department',
    role: 'programme_manager',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'coordinator@govcsr.com',
    password: 'coordinator123',
    phone: '+1234567891',
    organization: 'CSR Implementation Agency',
    role: 'beneficiary_coordinator',
  }
]

// Check if Firebase is properly initialized
const isFirebaseReady = () => {
  console.log('🔍 Checking Firebase readiness...');
  console.log('🔍 Auth object:', auth);
  console.log('🔍 Auth app:', auth?.app);
  console.log('🔍 Auth app options:', auth?.app?.options);
  console.log('🔍 Project ID:', auth?.app?.options?.projectId);
  
  try {
    const isReady = auth && auth.app && auth.app.options && auth.app.options.projectId;
    console.log('🔍 Firebase ready status:', isReady);
    
    if (!isReady) {
      console.warn('⚠️ Firebase not ready. Missing:');
      if (!auth) console.warn('  - Auth object');
      if (!auth?.app) console.warn('  - Auth app');
      if (!auth?.app?.options) console.warn('  - Auth app options');
      if (!auth?.app?.options?.projectId) console.warn('  - Project ID');
    }
    
    return isReady;
  } catch (error) {
    console.error('❌ Error checking Firebase readiness:', error);
    return false
  }
}

export const authService = {
  // Test Firebase connection
  async testConnection() {
    try {
      console.log('Testing Firebase connection...')
      const ready = isFirebaseReady()
      console.log('Firebase ready:', ready)
      
      if (ready) {
        console.log('Auth object:', auth)
        console.log('Auth app:', auth.app)
        console.log('Project ID:', auth.app.options.projectId)
        return { success: true, message: 'Firebase connection successful', ready: true }
      } else {
        return { success: false, message: 'Firebase not properly initialized', ready: false }
      }
    } catch (error) {
      console.error('Firebase connection test failed:', error)
      return { success: false, message: error.message, ready: false }
    }
  },

  async login(email, password) {
    try {
      console.log('Attempting login with:', { email, password: '***' })
      
      // Check if Firebase is ready
      if (!isFirebaseReady()) {
        console.warn('Firebase not ready, using fallback authentication')
        return this.fallbackLogin(email, password)
      }
      
      console.log('Using Firebase authentication')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Firebase login successful, user:', user)
      
      // Get additional user data from Firestore
      let userData = null
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        userData = userDoc.exists() ? userDoc.data() : null
        console.log('User data from Firestore:', userData)
      } catch (firestoreError) {
        console.warn('Could not fetch user data from Firestore:', firestoreError)
      }
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userData
        },
        token: await user.getIdToken()
      }
    } catch (error) {
      console.error('Firebase login error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // If Firebase fails, try fallback
      if (error.code === 'auth/configuration-not-found' || 
          error.code === 'auth/project-not-found' ||
          error.message.includes('400')) {
        console.warn('Firebase configuration error, trying fallback')
        return this.fallbackLogin(email, password)
      }
      
      throw new Error(this.getErrorMessage(error.code))
    }
  },
  
  async signup(userData) {
    try {
      console.log('Attempting signup with:', { ...userData, password: '***' })
      
      // Check if Firebase is ready
      if (!isFirebaseReady()) {
        console.warn('Firebase not ready, using fallback signup')
        return this.fallbackSignup(userData)
      }
      
      console.log('Using Firebase signup')
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )
      const user = userCredential.user
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      })
      
      // Store additional user data in Firestore
      const userDocData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        organization: userData.organization,
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      try {
        await setDoc(doc(db, 'users', user.uid), userDocData)
        console.log('User data saved to Firestore')
      } catch (firestoreError) {
        console.warn('Could not save user data to Firestore:', firestoreError)
      }
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userDocData
        },
        token: await user.getIdToken()
      }
    } catch (error) {
      console.error('Firebase signup error:', error)
      
      // If Firebase fails, try fallback
      if (error.code === 'auth/configuration-not-found' || 
          error.code === 'auth/project-not-found' ||
          error.message.includes('400')) {
        console.warn('Firebase configuration error, trying fallback')
        return this.fallbackSignup(userData)
      }
      
      throw new Error(this.getErrorMessage(error.code))
    }
  },
  
  async loginWithGoogle() {
    try {
      console.log('🚀 GOOGLE LOGIN DEBUG START');
      console.log('=====================================');
      console.log('🔍 Attempting Google login...');
      
      // Check Firebase readiness
      console.log('🔍 Checking Firebase readiness...');
      const firebaseReady = isFirebaseReady();
      console.log('🔍 Firebase ready:', firebaseReady);
      
      if (!firebaseReady) {
        console.error('❌ Firebase not ready. Details:');
        console.error('  - Auth object:', auth);
        console.error('  - Auth app:', auth?.app);
        console.error('  - Auth config:', auth?.config);
        console.error('  - Project ID:', auth?.app?.options?.projectId);
        throw new Error('Firebase not ready. Please check your configuration.')
      }
      
      console.log('✅ Firebase is ready, proceeding with Google login...');
      console.log('🔍 Auth object:', auth);
      console.log('🔍 Google provider:', googleProvider);
      console.log('🔍 Provider ID:', googleProvider?.providerId);
      console.log('🔍 Provider scopes:', googleProvider?.scopes);
      
      console.log('🔍 Calling signInWithPopup...');
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ signInWithPopup successful!');
      console.log('🔍 Result:', result);
      
      const user = result.user
      console.log('✅ Google login successful!');
      console.log('👤 User object:', user);
      console.log('👤 User UID:', user.uid);
      console.log('👤 User email:', user.email);
      console.log('👤 User display name:', user.displayName);
      console.log('👤 User photo URL:', user.photoURL);
      
      // Get additional user data from Firestore
      let userData = null
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        userData = userDoc.exists() ? userDoc.data() : null
        console.log('User data from Firestore:', userData)
      } catch (firestoreError) {
        console.warn('Could not fetch user data from Firestore:', firestoreError)
      }
      
      // If user doesn't exist in Firestore, create a basic profile
      if (!userData) {
        const basicUserData = {
          firstName: user.displayName?.split(' ')[0] || 'User',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phoneNumber || '',
          organization: 'Google User',
          role: 'user',
          provider: 'google',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        try {
          await setDoc(doc(db, 'users', user.uid), basicUserData)
          userData = basicUserData
          console.log('Created new user profile in Firestore')
        } catch (firestoreError) {
          console.warn('Could not save user data to Firestore:', firestoreError)
        }
      }
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userData
        },
        token: await user.getIdToken()
      }
    } catch (error) {
      console.error('❌ GOOGLE LOGIN ERROR DEBUG');
      console.log('=====================================');
      console.error('❌ Error object:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error cause:', error.cause);
      
      // Additional Firebase-specific error details
      if (error.code) {
        console.error('🔍 Firebase error code:', error.code);
        console.error('🔍 Error details:', {
          code: error.code,
          message: error.message,
          customData: error.customData
        });
      }
      
      console.log('=====================================');
      throw new Error(this.getErrorMessage(error.code))
    }
  },
  
  async loginWithFacebook() {
    try {
      console.log('Attempting Facebook login')
      
      if (!isFirebaseReady()) {
        throw new Error('Firebase not ready. Please check your configuration.')
      }
      
      const result = await signInWithPopup(auth, facebookProvider)
      const user = result.user
      console.log('Facebook login successful, user:', user)
      
      // Get additional user data from Firestore
      let userData = null
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        userData = userDoc.exists() ? userDoc.data() : null
        console.log('User data from Firestore:', userData)
      } catch (firestoreError) {
        console.warn('Could not fetch user data from Firestore:', firestoreError)
      }
      
      // If user doesn't exist in Firestore, create a basic profile
      if (!userData) {
        const basicUserData = {
          firstName: user.displayName?.split(' ')[0] || 'User',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phoneNumber || '',
          organization: 'Facebook User',
          role: 'user',
          provider: 'facebook',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        try {
          await setDoc(doc(db, 'users', user.uid), basicUserData)
          userData = basicUserData
          console.log('Created new user profile in Firestore')
        } catch (firestoreError) {
          console.warn('Could not save user data to Firestore:', firestoreError)
        }
      }
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userData
        },
        token: await user.getIdToken()
      }
    } catch (error) {
      console.error('Facebook login error:', error)
      throw new Error(this.getErrorMessage(error.code))
    }
  },

  async logout() {
    try {
      if (isFirebaseReady()) {
        await signOut(auth)
        console.log('Firebase logout successful')
      } else {
        console.log('Firebase not ready, using fallback logout')
        // Fallback logout - just clear local state
        localStorage.removeItem('userData')
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Failed to sign out')
    }
  },
  
  async getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!isFirebaseReady()) {
        console.warn('Firebase not ready, checking localStorage for user')
        const userData = localStorage.getItem('userData')
        if (userData) {
          try {
            resolve(JSON.parse(userData))
          } catch (error) {
            resolve(null)
          }
        } else {
          resolve(null)
        }
        return
      }
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe()
        if (user) {
          try {
            // Get additional user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            const userData = userDoc.exists() ? userDoc.data() : null
            
            resolve({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...userData
            })
          } catch (error) {
            reject(error)
          }
        } else {
          resolve(null)
        }
      })
    })
  },
  
  // Fallback authentication methods
  async fallbackLogin(email, password) {
    console.log('Using fallback authentication')
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user
    
    // Store in localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userWithoutPassword))
    localStorage.setItem('authToken', `fallback-token-${user.id}-${Date.now()}`)
    
    return {
      user: userWithoutPassword,
      token: `fallback-token-${user.id}-${Date.now()}`
    }
  },
  
  async fallbackSignup(userData) {
    console.log('Using fallback signup')
    
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    // Create new user
    const newUser = {
      id: DEMO_USERS.length + 1,
      ...userData,
      password: userData.password
    }
    
    DEMO_USERS.push(newUser)
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser
    
    // Store in localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userWithoutPassword))
    localStorage.setItem('authToken', `fallback-token-${newUser.id}-${Date.now()}`)
    
    return {
      user: userWithoutPassword,
      token: `fallback-token-${newUser.id}-${Date.now()}`
    }
  },
  
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      case 'auth/configuration-not-found':
        return 'Firebase configuration not found. Using fallback authentication.'
      case 'auth/project-not-found':
        return 'Firebase project not found. Using fallback authentication.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.'
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please allow popups and try again.'
      case 'auth/cancelled-popup-request':
        return 'Sign-in popup was cancelled. Please try again.'
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email address using a different sign-in method.'
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please contact support.'
      case 'auth/requires-recent-login':
        return 'Please sign in again to complete this action.'
      default:
        return 'Authentication failed. Please try again'
    }
  }
}
