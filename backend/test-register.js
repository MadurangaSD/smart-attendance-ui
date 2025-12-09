// Simple registration test
const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration...');
    
    const userData = {
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'student'
    };

    console.log('Sending data:', JSON.stringify(userData, null, 2));

    const response = await axios.post('http://localhost:5000/register', userData);
    
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRegistration();
