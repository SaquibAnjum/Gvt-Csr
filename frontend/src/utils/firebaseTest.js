// Firebase Project Test Utility
export const testFirebaseProject = async () => {
  const apiKey = "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4";
  const projectId = "gvt-csr";
  
  try {
    console.log('🔍 Testing Firebase project configuration...');
    console.log('API Key:', apiKey);
    console.log('Project ID:', projectId);
    
    // Test 1: Check if project exists
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects?key=${apiKey}`
    );
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 400) {
      console.error('❌ Project not found or configuration invalid');
      console.error('💡 This means:');
      console.error('   - Project "gvt-csr" does not exist in Firebase Console');
      console.error('   - Or Authentication is not enabled');
      console.error('   - Or API key is invalid');
      return {
        success: false,
        error: 'Project not found or configuration invalid',
        suggestion: 'Create new Firebase project or enable Authentication'
      };
    }
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ Project found:', data);
      return {
        success: true,
        data: data,
        message: 'Project configuration is valid'
      };
    }
    
    console.warn('⚠️ Unexpected response:', response.status);
    return {
      success: false,
      error: `Unexpected response: ${response.status}`,
      suggestion: 'Check Firebase Console configuration'
    };
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return {
      success: false,
      error: error.message,
      suggestion: 'Check internet connection and Firebase Console'
    };
  }
};

// Test Firebase Authentication configuration
export const testFirebaseAuth = async () => {
  const apiKey = "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4";
  const projectId = "gvt-csr";
  
  try {
    console.log('🔍 Testing Firebase Authentication configuration...');
    
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${apiKey}`
    );
    
    console.log('📡 Auth config status:', response.status);
    
    if (response.status === 400) {
      console.error('❌ Authentication not configured');
      console.error('💡 This means:');
      console.error('   - Authentication is not enabled in Firebase Console');
      console.error('   - Or project does not exist');
      console.error('   - Or API key is invalid');
      return {
        success: false,
        error: 'Authentication not configured',
        suggestion: 'Enable Authentication in Firebase Console'
      };
    }
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ Authentication configured:', data);
      return {
        success: true,
        data: data,
        message: 'Authentication is properly configured'
      };
    }
    
    return {
      success: false,
      error: `Unexpected response: ${response.status}`,
      suggestion: 'Check Firebase Console Authentication settings'
    };
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return {
      success: false,
      error: error.message,
      suggestion: 'Check internet connection and Firebase Console'
    };
  }
};

// Run all tests
export const runFirebaseTests = async () => {
  console.log('🚀 Running Firebase configuration tests...');
  console.log('=====================================');
  
  const projectTest = await testFirebaseProject();
  console.log('=====================================');
  
  const authTest = await testFirebaseAuth();
  console.log('=====================================');
  
  console.log('📊 Test Results Summary:');
  console.log('Project Test:', projectTest.success ? '✅ PASS' : '❌ FAIL');
  console.log('Auth Test:', authTest.success ? '✅ PASS' : '❌ FAIL');
  
  if (!projectTest.success || !authTest.success) {
    console.log('💡 Recommendations:');
    console.log('1. Go to https://console.firebase.google.com/');
    console.log('2. Create project "gvt-csr" or check existing project');
    console.log('3. Enable Authentication → Sign-in method');
    console.log('4. Enable Email/Password provider');
    console.log('5. Test again');
  }
  
  return {
    project: projectTest,
    auth: authTest,
    allPassed: projectTest.success && authTest.success
  };
};
