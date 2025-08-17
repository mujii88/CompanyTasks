const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testTaskId = '';

// Test data
const testUser = {
  name: 'API Test User',
  email: 'apitest@example.com',
  password: 'password123',
  role: 'manager',
  department: 'Testing'
};

const testTask = {
  title: 'API Test Task',
  description: 'This is a test task created via API',
  assignee: '', // Will be set after user creation
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  priority: 'medium'
};

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    authToken = registerResponse.data.token;
    testUserId = registerResponse.data.user.id;
    console.log('✅ User registration passed:', registerResponse.data.user.email);

    // Test 3: User Login
    console.log('\n3. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User login passed:', loginResponse.data.user.email);

    // Test 4: Get User Profile
    console.log('\n4. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get profile passed:', profileResponse.data.user.name);

    // Test 5: Get Employees (Manager only)
    console.log('\n5. Testing Get Employees...');
    const employeesResponse = await axios.get(`${BASE_URL}/users/employees`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get employees passed:', employeesResponse.data.employees.length, 'employees found');

    // Test 6: Create Task
    console.log('\n6. Testing Create Task...');
    testTask.assignee = employeesResponse.data.employees[0]._id;
    const createTaskResponse = await axios.post(`${BASE_URL}/tasks`, testTask, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    testTaskId = createTaskResponse.data.task._id;
    console.log('✅ Create task passed:', createTaskResponse.data.task.title);

    // Test 7: Get All Tasks
    console.log('\n7. Testing Get All Tasks...');
    const tasksResponse = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get tasks passed:', tasksResponse.data.tasks.length, 'tasks found');

    // Test 8: Get Single Task
    console.log('\n8. Testing Get Single Task...');
    const singleTaskResponse = await axios.get(`${BASE_URL}/tasks/${testTaskId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get single task passed:', singleTaskResponse.data.task.title);

    // Test 9: Update Task
    console.log('\n9. Testing Update Task...');
    const updateTaskResponse = await axios.put(`${BASE_URL}/tasks/${testTaskId}`, {
      progress: 50,
      priority: 'high'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update task passed:', updateTaskResponse.data.task.progress, '% progress');

    // Test 10: Get Task Statistics
    console.log('\n10. Testing Get Task Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/tasks/stats/overview`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get stats passed:', statsResponse.data.stats.total, 'total tasks');

    // Test 11: Complete Task
    console.log('\n11. Testing Complete Task...');
    const completeTaskResponse = await axios.put(`${BASE_URL}/tasks/${testTaskId}`, {
      progress: 100
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Complete task passed:', completeTaskResponse.data.task.status);

    // Test 12: Delete Task
    console.log('\n12. Testing Delete Task...');
    const deleteTaskResponse = await axios.delete(`${BASE_URL}/tasks/${testTaskId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete task passed:', deleteTaskResponse.data.message);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ Health Check');
    console.log('- ✅ User Registration');
    console.log('- ✅ User Login');
    console.log('- ✅ Get User Profile');
    console.log('- ✅ Get Employees');
    console.log('- ✅ Create Task');
    console.log('- ✅ Get All Tasks');
    console.log('- ✅ Get Single Task');
    console.log('- ✅ Update Task');
    console.log('- ✅ Get Task Statistics');
    console.log('- ✅ Complete Task');
    console.log('- ✅ Delete Task');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
    process.exit(1);
  }
}

// Run the tests
runTests();
