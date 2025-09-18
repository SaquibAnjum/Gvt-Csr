// Comprehensive Firebase Debugger
import { auth, db, googleProvider, facebookProvider } from '../firebase/config'

export const firebaseDebugger = {
  // Test Firebase project existence
  async testProjectExistence() {
    console.log('🔍 TESTING FIREBASE PROJECT EXISTENCE');
    console.log('=====================================');
    
    const apiKey = "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4";
    const projectId = "gvt-csr";
    
    try {
      console.log('📡 Making request to Firebase API...');
      console.log('🔗 URL:', `https://identitytoolkit.googleapis.com/v1/projects?key=${apiKey}`);
      
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/projects?key=${apiKey}`
      );
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 200) {
        const data = await response.json();
        console.log('✅ Project exists!');
        console.log('📋 Project data:', data);
        return { success: true, data };
      } else if (response.status === 400) {
        console.error('❌ Project not found (400 error)');
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        return { success: false, error: 'Project not found' };
      } else {
        console.error('❌ Unexpected response:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        return { success: false, error: `Unexpected status: ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test Firebase Authentication configuration
  async testAuthConfiguration() {
    console.log('🔍 TESTING FIREBASE AUTH CONFIGURATION');
    console.log('=====================================');
    
    const apiKey = "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4";
    
    try {
      console.log('📡 Making request to Firebase Auth API...');
      console.log('🔗 URL:', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${apiKey}`);
      
      const response = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${apiKey}`
      );
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 200) {
        const data = await response.json();
        console.log('✅ Authentication is configured!');
        console.log('📋 Auth config:', data);
        return { success: true, data };
      } else if (response.status === 400) {
        console.error('❌ Authentication not configured (400 error)');
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        return { success: false, error: 'Authentication not configured' };
      } else {
        console.error('❌ Unexpected response:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        return { success: false, error: `Unexpected status: ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test Firebase client-side configuration
  testClientConfiguration() {
    console.log('🔍 TESTING FIREBASE CLIENT CONFIGURATION');
    console.log('=====================================');
    
    console.log('🔧 Auth object:', auth);
    console.log('🔧 Auth app:', auth?.app);
    console.log('🔧 Auth config:', auth?.config);
    console.log('🔧 Auth current user:', auth?.currentUser);
    console.log('🔧 Auth project ID:', auth?.app?.options?.projectId);
    
    console.log('🔧 DB object:', db);
    console.log('🔧 DB app:', db?.app);
    
    console.log('🔧 Google provider:', googleProvider);
    console.log('🔧 Google provider ID:', googleProvider?.providerId);
    console.log('🔧 Google provider scopes:', googleProvider?.scopes);
    
    console.log('🔧 Facebook provider:', facebookProvider);
    console.log('🔧 Facebook provider ID:', facebookProvider?.providerId);
    console.log('🔧 Facebook provider scopes:', facebookProvider?.scopes);
    
    // Check if all required objects exist
    const checks = {
      auth: !!auth,
      authApp: !!auth?.app,
      authConfig: !!auth?.config,
      projectId: !!auth?.app?.options?.projectId,
      db: !!db,
      googleProvider: !!googleProvider,
      facebookProvider: !!facebookProvider
    };
    
    console.log('📊 Configuration checks:', checks);
    
    const allPassed = Object.values(checks).every(check => check);
    console.log('✅ All checks passed:', allPassed);
    
    if (!allPassed) {
      console.error('❌ Missing components:');
      Object.entries(checks).forEach(([key, value]) => {
        if (!value) console.error(`  - ${key}`);
      });
    }
    
    return { success: allPassed, checks };
  },

  // Test Firebase initialization
  testInitialization() {
    console.log('🔍 TESTING FIREBASE INITIALIZATION');
    console.log('=====================================');
    
    try {
      // Test if Firebase is properly initialized
      const isInitialized = auth && auth.app && auth.app.options;
      console.log('🔧 Firebase initialized:', isInitialized);
      
      if (isInitialized) {
        console.log('✅ Firebase is properly initialized');
        console.log('📱 App name:', auth.app.name);
        console.log('⚙️ App options:', auth.app.options);
        console.log('🔑 Project ID:', auth.app.options.projectId);
        console.log('🌐 API Key:', auth.app.options.apiKey);
        console.log('🌐 Auth Domain:', auth.app.options.authDomain);
      } else {
        console.error('❌ Firebase is not properly initialized');
        console.error('Missing components:');
        if (!auth) console.error('  - Auth object');
        if (!auth?.app) console.error('  - Auth app');
        if (!auth?.app?.options) console.error('  - Auth app options');
      }
      
      return { success: isInitialized };
    } catch (error) {
      console.error('❌ Error testing initialization:', error);
      return { success: false, error: error.message };
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🚀 RUNNING COMPREHENSIVE FIREBASE DEBUG');
    console.log('==========================================');
    
    const results = {
      initialization: this.testInitialization(),
      clientConfig: this.testClientConfiguration(),
      projectExistence: await this.testProjectExistence(),
      authConfiguration: await this.testAuthConfiguration()
    };
    
    console.log('📊 ALL TEST RESULTS:');
    console.log('==========================================');
    Object.entries(results).forEach(([test, result]) => {
      console.log(`${test}:`, result.success ? '✅ PASS' : '❌ FAIL');
      if (!result.success) {
        console.log(`  Error: ${result.error}`);
      }
    });
    
    const allPassed = Object.values(results).every(result => result.success);
    console.log('🎯 OVERALL RESULT:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    if (!allPassed) {
      console.log('💡 RECOMMENDATIONS:');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Create project "gvt-csr" or check existing project');
      console.log('3. Enable Authentication → Sign-in method');
      console.log('4. Enable Email/Password provider');
      console.log('5. Test again');
    }
    
    return { success: allPassed, results };
  }
};

// Export individual test functions
export const testProjectExistence = firebaseDebugger.testProjectExistence.bind(firebaseDebugger);
export const testAuthConfiguration = firebaseDebugger.testAuthConfiguration.bind(firebaseDebugger);
export const testClientConfiguration = firebaseDebugger.testClientConfiguration.bind(firebaseDebugger);
export const testInitialization = firebaseDebugger.testInitialization.bind(firebaseDebugger);
export const runAllTests = firebaseDebugger.runAllTests.bind(firebaseDebugger);
