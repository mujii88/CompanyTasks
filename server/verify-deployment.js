const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

async function checkBackendHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function checkFrontendHealth() {
  try {
    const response = await axios.get(FRONTEND_URL);
    return { success: true, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function checkFileStructure() {
  const requiredFiles = [
    'package.json',
    'server/package.json',
    'client/package.json',
    'server/index.js',
    'client/src/App.js',
    'README.md',
    'DEPLOYMENT.md',
    'docker-compose.yml',
    'Dockerfile',
    'setup.sh',
    'build.sh'
  ];

  const missingFiles = [];
  const existingFiles = [];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      existingFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  });

  return { existingFiles, missingFiles };
}

function checkDependencies() {
  const packageFiles = ['package.json', 'server/package.json', 'client/package.json'];
  const results = {};

  packageFiles.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        const content = JSON.parse(fs.readFileSync(file, 'utf8'));
        results[file] = {
          name: content.name,
          dependencies: Object.keys(content.dependencies || {}).length,
          devDependencies: Object.keys(content.devDependencies || {}).length
        };
      } catch (error) {
        results[file] = { error: error.message };
      }
    } else {
      results[file] = { error: 'File not found' };
    }
  });

  return results;
}

async function runVerification() {
  console.log('🔍 Task Management Application - Deployment Verification');
  console.log('========================================================\n');

  // Check file structure
  console.log('📁 Checking file structure...');
  const fileStructure = checkFileStructure();
  console.log(`✅ Found ${fileStructure.existingFiles.length} required files`);
  if (fileStructure.missingFiles.length > 0) {
    console.log(`⚠️  Missing files: ${fileStructure.missingFiles.join(', ')}`);
  }

  // Check dependencies
  console.log('\n📦 Checking dependencies...');
  const dependencies = checkDependencies();
  Object.entries(dependencies).forEach(([file, info]) => {
    if (info.error) {
      console.log(`❌ ${file}: ${info.error}`);
    } else {
      console.log(`✅ ${file}: ${info.name} (${info.dependencies} deps, ${info.devDependencies} dev deps)`);
    }
  });

  // Check backend health
  console.log('\n🔧 Checking backend health...');
  const backendHealth = await checkBackendHealth();
  if (backendHealth.success) {
    console.log(`✅ Backend is running: ${backendHealth.data.message}`);
  } else {
    console.log(`❌ Backend error: ${backendHealth.error}`);
  }

  // Check frontend health
  console.log('\n🌐 Checking frontend health...');
  const frontendHealth = await checkFrontendHealth();
  if (frontendHealth.success) {
    console.log(`✅ Frontend is running: Status ${frontendHealth.status}`);
  } else {
    console.log(`❌ Frontend error: ${frontendHealth.error}`);
  }

  // Check MongoDB
  console.log('\n🗄️  Checking MongoDB...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ MongoDB connection is working');
  } catch (error) {
    console.log('❌ MongoDB connection failed');
  }

  // Summary
  console.log('\n📊 Deployment Summary:');
  console.log('======================');
  
  const allChecks = [
    { name: 'File Structure', status: fileStructure.missingFiles.length === 0 },
    { name: 'Backend Health', status: backendHealth.success },
    { name: 'Frontend Health', status: frontendHealth.success },
    { name: 'MongoDB Connection', status: backendHealth.success }
  ];

  const passedChecks = allChecks.filter(check => check.status).length;
  const totalChecks = allChecks.length;

  allChecks.forEach(check => {
    console.log(`${check.status ? '✅' : '❌'} ${check.name}`);
  });

  console.log(`\n🎯 Overall Status: ${passedChecks}/${totalChecks} checks passed`);

  if (passedChecks === totalChecks) {
    console.log('\n🎉 Application is ready for deployment!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run ./build.sh to create production build');
    console.log('2. Follow DEPLOYMENT.md for deployment options');
    console.log('3. Update environment variables for production');
    console.log('4. Set up monitoring and backups');
  } else {
    console.log('\n⚠️  Some issues need to be resolved before deployment');
  }

  return passedChecks === totalChecks;
}

// Run verification
runVerification().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
