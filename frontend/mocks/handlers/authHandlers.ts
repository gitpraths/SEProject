import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any
    console.log('Login request:', body)
    
    const role = body.role || 'Volunteer'
    const email = body.email || body.phone || 'user@example.com'
    
    return HttpResponse.json({
      token: `mock-${role.toLowerCase()}-token-${Date.now()}`,
      role: role,
      name: email.split('@')[0],
      email: email,
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
    const body = await request.json() as any
    console.log('Register request:', body)
    
    const role = body.role || 'Volunteer'
    
    return HttpResponse.json({
      success: true,
      token: `mock-${role.toLowerCase()}-token-${Date.now()}`,
      role: role,
      name: body.name,
      email: body.email,
      message: 'Registration successful',
    })
  }),
]
