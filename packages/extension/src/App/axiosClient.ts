import axios from 'axios'

// Docs: https://www.npmjs.com/package/axios#instance-methods
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance
