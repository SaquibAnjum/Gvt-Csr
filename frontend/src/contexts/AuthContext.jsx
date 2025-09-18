import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/authServiceHybrid'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setUser(user)
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      const data = await authService.login(email, password)
      
      setUser(data.user)
      toast.success('Login successful!')
      
      // Return success to let the component handle navigation
      return { success: true, user: data.user }
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Invalid email or password')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      
      const data = await authService.signup(userData)
      
      setUser(data.user)
      toast.success('Account created successfully!')
      
      // Return success to let the component handle navigation
      return { success: true, user: data.user }
      
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      console.log('🔐 AUTH CONTEXT: Google login started');
      setLoading(true)
      
      console.log('🔐 AUTH CONTEXT: Calling authService.loginWithGoogle()');
      const data = await authService.loginWithGoogle()
      console.log('🔐 AUTH CONTEXT: Google login successful, data:', data)
      
      setUser(data.user)
      console.log('🔐 AUTH CONTEXT: User set in context:', data.user)
      toast.success('Google login successful!')
      
      return { success: true, user: data.user }
      
    } catch (error) {
      console.error('❌ AUTH CONTEXT: Google login error');
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      toast.error(error.message || 'Google login failed')
      return { success: false, error: error.message }
    } finally {
      console.log('🔐 AUTH CONTEXT: Google login finished, setting loading to false');
      setLoading(false)
    }
  }

  const loginWithFacebook = async () => {
    try {
      setLoading(true)
      
      const data = await authService.loginWithFacebook()
      
      setUser(data.user)
      toast.success('Facebook login successful!')
      
      return { success: true, user: data.user }
      
    } catch (error) {
      console.error('Facebook login error:', error)
      toast.error(error.message || 'Facebook login failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Logged out successfully')
      // Navigation will be handled by the component using this function
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
