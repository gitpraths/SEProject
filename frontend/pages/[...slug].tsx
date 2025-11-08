import React from 'react'
import App from '../client/src/App'

// Non-optional catch-all route so client-side routes work when navigated to directly
// (prevents Next from returning 404 for SPA paths like /login).
export default function CatchAll() {
  return <App />
}
