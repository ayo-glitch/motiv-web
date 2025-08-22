// Simple script to test API endpoints
const API_BASE = 'http://localhost:8080/api/v1';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test 1: Get all events (public endpoint)
  try {
    const response = await fetch(`${API_BASE}/events`);
    const data = await response.json();
    console.log('✅ GET /events:', response.status, data);
  } catch (error) {
    console.log('❌ GET /events failed:', error.message);
  }

  // Test 2: Try to get a specific event
  try {
    const response = await fetch(`${API_BASE}/events/test-id`);
    const data = await response.json();
    console.log('✅ GET /events/:id:', response.status, data);
  } catch (error) {
    console.log('❌ GET /events/:id failed:', error.message);
  }

  // Test 3: Test auth endpoints (should fail without credentials)
  try {
    const response = await fetch(`${API_BASE}/users/me`);
    console.log('✅ GET /users/me (should be 401):', response.status);
  } catch (error) {
    console.log('❌ GET /users/me failed:', error.message);
  }

  console.log('\nAPI test complete!');
}

// Run if called directly
if (typeof window === 'undefined') {
  testAPI();
}

module.exports = { testAPI };