// Create demo user accounts for testing
const axios = require('axios');

const API_URL = 'http://localhost:5000';

const demoUsers = [
  {
    email: 'admin@smartattendance.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin'
  },
  {
    email: 'lecturer@smartattendance.com',
    password: 'lecturer123',
    fullName: 'Lecturer User',
    role: 'lecturer'
  },
  {
    email: 'student@smartattendance.com',
    password: 'student123',
    fullName: 'Student User',
    role: 'student'
  }
];

async function createDemoUsers() {
  console.log('🚀 Creating demo user accounts...\n');

  for (const user of demoUsers) {
    try {
      const response = await axios.post(`${API_URL}/register`, user);
      console.log(`✅ Created ${user.role}: ${user.email}`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg.includes('already exists')) {
        console.log(`ℹ️  Already exists: ${user.email}`);
      } else {
        console.log(`❌ Failed to create ${user.email}: ${errorMsg}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Demo users setup complete!');
  console.log('='.repeat(60));
  console.log('\nYou can now login with:');
  console.log('  Admin: admin@smartattendance.com / admin123');
  console.log('  Lecturer: lecturer@smartattendance.com / lecturer123');
  console.log('  Student: student@smartattendance.com / student123');
}

createDemoUsers().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
