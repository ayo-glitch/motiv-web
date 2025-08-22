// Test CORS configuration
async function testCORS() {
  const API_BASE = 'http://localhost:8080/api/v1';
  
  console.log('🔍 Testing CORS configuration...\n');

  try {
    // Test preflight request (OPTIONS)
    console.log('1. Testing preflight request...');
    const preflightResponse = await fetch(`${API_BASE}/events`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    console.log('   Status:', preflightResponse.status);
    console.log('   CORS Headers:');
    console.log('   - Access-Control-Allow-Origin:', preflightResponse.headers.get('Access-Control-Allow-Origin'));
    console.log('   - Access-Control-Allow-Methods:', preflightResponse.headers.get('Access-Control-Allow-Methods'));
    console.log('   - Access-Control-Allow-Headers:', preflightResponse.headers.get('Access-Control-Allow-Headers'));
    console.log('   - Access-Control-Allow-Credentials:', preflightResponse.headers.get('Access-Control-Allow-Credentials'));

    // Test actual request
    console.log('\n2. Testing actual GET request...');
    const response = await fetch(`${API_BASE}/events`, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Status:', response.status);
    console.log('   Response CORS Headers:');
    console.log('   - Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Request successful!');
      console.log('   Response data type:', typeof data);
    } else {
      console.log('   ❌ Request failed with status:', response.status);
      const errorText = await response.text();
      console.log('   Error:', errorText);
    }

  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
    
    if (error.message.includes('CORS')) {
      console.log('\n🔧 CORS Issue Detected!');
      console.log('Make sure your backend has proper CORS configuration:');
      console.log('- AllowOrigins: http://localhost:3000');
      console.log('- AllowMethods: GET,POST,PUT,DELETE,OPTIONS');
      console.log('- AllowHeaders: Origin,Content-Type,Accept,Authorization');
      console.log('- AllowCredentials: true');
    } else if (error.message.includes('fetch')) {
      console.log('\n🔧 Connection Issue!');
      console.log('Make sure your backend is running on http://localhost:8080');
    }
  }
}

// Run the test
testCORS();