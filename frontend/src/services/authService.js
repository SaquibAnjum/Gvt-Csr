// Firebase Authentication service
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export const authService = {
  // Test Firebase connection
  async testConnection() {
    try {
      console.log('Testing Firebase connection...')
      console.log('Auth object:', auth)
      console.log('Auth app:', auth.app)
      console.log('Auth current user:', auth.currentUser)
      console.log('DB object:', db)
      return { success: true, message: 'Firebase connection successful' }
    } catch (error) {
      console.error('Firebase connection test failed:', error)
      return { success: false, message: error.message }
    }
  },

  async login(email, password) {
    try {
      console.log('Attempting to login with:', { email, password: '***' })
      console.log('Firebase auth object:', auth)
      console.log('Firebase app:', auth.app)
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Login successful, user:', user)
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.exists() ? userDoc.data() : null
      console.log('User data from Firestore:', userData)
      
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
      throw new Error(this.getErrorMessage(error.code))
    }
  },
  
  async signup(userData) {
    try {
      // Create user with email and password
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
      
      await setDoc(doc(db, 'users', user.uid), userDocData)
      
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
      throw new Error(this.getErrorMessage(error.code))
    }
  },
  
  async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error('Failed to sign out')
    }
  },
  
  async getCurrentUser() {
    return new Promise((resolve, reject) => {
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
  
  async validateToken() {
    const user = auth.currentUser
    if (!user) {
      throw new Error('No authenticated user')
    }
    
    try {
      const token = await user.getIdToken()
      return { user, token }
    } catch (error) {
      throw new Error('Failed to validate token')
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
      default:
        return 'Authentication failed. Please try again'
    }
  }
}
