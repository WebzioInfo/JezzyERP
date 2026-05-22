import axios from 'axios'

async function testLogin() {
  try {
    console.log('Sending login request to http://localhost:3001/api/auth/login...')
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@jezzy.local',
      password: 'Password@123'
    })
    console.log('Login Response Status:', response.status)
    console.log('Login Response Data:', response.data)
    if (response.data.success && response.data.role === 'ADMIN') {
      console.log('SUCCESS: Authentication verified successfully!')
    } else {
      console.error('FAILED: Unexpected response data.')
    }
  } catch (error) {
    if (error.response) {
      console.error('FAILED: Server responded with status:', error.response.status)
      console.error('Response data:', error.response.data)
    } else {
      console.error('FAILED: Request failed with message:', error.message)
    }
  }
}

testLogin()
