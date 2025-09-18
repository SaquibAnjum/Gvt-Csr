// Quick Firebase Test - Check if project exists and is configured
export const quickFirebaseTest = async () => {
  const apiKey = "AIzaSyD28GTYks3WPxRVO3eG7VtxolN5DPGXhn4";
  
  console.log('🔍 Quick Firebase Test Starting...');
  console.log('API Key:', apiKey);
  console.log('Project ID: gvt-csr');
  
  try {
    // Test 1: Check if project exists
    console.log('📡 Testing project existence...');
    const projectResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects?key=${apiKey}`
    );
    
    console.log('Project response status:', projectResponse.status);
    
    if (projectResponse.status === 400) {
      console.error('❌ PROJECT NOT FOUND');
      console.error('💡 Solution: Create project "gvt-csr" in Firebase Console');
      console.error('🔗 Go to: https://console.firebase.google.com/');
      return { success: false, issue: 'Project not found' };
    }
    
    if (projectResponse.status === 200) {
      console.log('✅ Project exists!');
      
      // Test 2: Check Authentication configuration
      console.log('📡 Testing Authentication configuration...');
      const authResponse = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${apiKey}`
      );
      
      console.log('Auth response status:', authResponse.status);
      
      if (authResponse.status === 400) {
        console.error('❌ AUTHENTICATION NOT ENABLED');
        console.error('💡 Solution: Enable Authentication in Firebase Console');
        console.error('🔗 Go to: Authentication → Get started → Sign-in method');
        return { success: false, issue: 'Authentication not enabled' };
      }
      
      if (authResponse.status === 200) {
        console.log('✅ Authentication is configured!');
        console.log('🎉 Firebase is properly set up!');
        return { success: true, message: 'Firebase is working correctly' };
      }
    }
    
    console.warn('⚠️ Unexpected response');
    return { success: false, issue: 'Unexpected response' };
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, issue: 'Network error' };
  }
};

// Run the test
export const runQuickTest = async () => {
  console.log('🚀 Running Quick Firebase Test...');
  console.log('=====================================');
  
  const result = await quickFirebaseTest();
  
  console.log('=====================================');
  console.log('📊 Test Result:', result.success ? '✅ SUCCESS' : '❌ FAILED');
  
  if (!result.success) {
    console.log('💡 Next Steps:');
    console.log('1. Go to https://console.firebase.google.com/');
    console.log('2. Create project "gvt-csr" or check existing project');
    console.log('3. Enable Authentication → Sign-in method');
    console.log('4. Enable Email/Password provider');
    console.log('5. Test again');
  }
  
  return result;
};
