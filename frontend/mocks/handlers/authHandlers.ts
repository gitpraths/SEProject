import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()
    console.log('Login request:', body)
    
    return HttpResponse.json({
      token: 'mock-token-' + Date.now(),
      role: body.role || 'Volunteer',
      user: body.email,
    })
  }),

  // Send OTP endpoint
  http.post('/api/auth/send-otp', async ({ request }) => {
    const body = await request.json()
    console.log('Send OTP request:', body)
    
    return HttpResponse.json({
      otp: '123456',
      message: 'OTP sent successfully',
    })
  }),

  // Register endpoint
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json()
    console.log('Register request:', body)
    
    return HttpResponse.json({
      success: true,
      token: 'mock-token-' + Date.now(),
      message: 'Registration successful',
    })
  }),
]
