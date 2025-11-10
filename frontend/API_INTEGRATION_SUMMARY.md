# API Integration Summary

## ✅ What's Been Implemented

### 1. API Client (`utils/api.ts`)
- **Axios-based HTTP client** with TypeScript support
- **Automatic token management** via localStorage
- **Request/Response interceptors** for auth and error handling
- **Flask-compatible response format** handling
- **Retry logic** for failed requests
- **Type-safe API methods** for all endpoints

### 2. Socket.IO Client (`utils/socket.ts`)
- **Real-time WebSocket connection** to Flask backend
- **Automatic reconnection** with exponential backoff
- **Room management** (join/leave rooms)
- **Event listeners** for real-time updates
- **Connection status monitoring**

### 3. Error Handling (`utils/errorHandler.ts`)
- **Centralized error handling** with user-friendly messages
- **Validation error parsing** from Flask
- **Error type detection** (network, auth, validation, server)
- **Notification system integration** ready

### 4. React Hooks (`hooks/useApi.ts`)
- **useApi** - Generic API call hook with loading/error states
- **useFetch** - Auto-fetch data on mount
- **useMutation** - POST/PUT/DELETE operations
- **usePagination** - Paginated data with navigation
- **useUpload** - File upload with progress tracking

### 5. Socket Hooks (`hooks/useSocket.ts`)
- **useSocket** - Generic Socket.IO hook
- **useShelterUpdates** - Real-time shelter capacity updates
- **useNewIndividualNotifications** - New registration alerts
- **useJobPlacementNotifications** - Job placement updates
- **useRecommendationNotifications** - AI recommendation alerts
- **useEmergencyAlerts** - Emergency notifications
- **useChatMessages** - Real-time chat messages

## 📁 Files Created

### Frontend
```
frontend/
├── utils/
│   ├── api.ts                    # Main API client
│   ├── socket.ts                 # Socket.IO client
│   └── errorHandler.ts           # Error handling utilities
├── hooks/
│   ├── useApi.ts                 # API hooks
│   ├── useSocket.ts              # Socket hooks
│   ├── useOffline.ts             # Offline detection
│   └── useSwipe.ts               # Touch gestures
├── app/
│   └── api-demo/
│       └── page.tsx              # Complete demo page
├── API_INTEGRATION_GUIDE.md      # Detailed usage guide
└── API_INTEGRATION_SUMMARY.md    # This file
```

### Backend
```
backend/
├── FLASK_API_SETUP.md            # Flask setup guide
└── app.py                        # Example Flask app (to be created)
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install axios socket.io-client
```

### 2. Configure Environment

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Backend

```bash
cd backend
pip install flask flask-cors flask-socketio python-socketio flask-jwt-extended
python app.py
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

### 5. Test Integration

Visit: `http://localhost:3000/api-demo`

## 📚 Usage Examples

### Simple API Call

```tsx
import { api } from '@/utils/api';

const individuals = await api.getAllIndividuals({ page: 1, limit: 10 });
```

### With React Hook

```tsx
import { useFetch } from '@/hooks/useApi';
import { api } from '@/utils/api';

const { data, loading, error } = useFetch(() => api.getAllIndividuals());
```

### Real-Time Updates

```tsx
import { useShelterUpdates } from '@/hooks/useSocket';

useShelterUpdates((data) => {
  console.log('Shelter updated:', data);
});
```

### File Upload

```tsx
import { useUpload } from '@/hooks/useApi';

const { upload, progress, loading } = useUpload();

await upload(file, individualId, 'id_proof');
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Individuals
- `GET /api/individuals` - List individuals (paginated)
- `GET /api/individuals/:id` - Get individual by ID
- `POST /api/individuals` - Create individual
- `PUT /api/individuals/:id` - Update individual
- `DELETE /api/individuals/:id` - Delete individual
- `GET /api/individuals/search` - Search individuals

### Shelters
- `GET /api/shelters` - List all shelters
- `GET /api/shelters/available` - List available shelters
- `GET /api/shelters/:id` - Get shelter by ID
- `PATCH /api/shelters/:id/capacity` - Update capacity

### Jobs
- `GET /api/jobs` - List jobs (paginated)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job
- `POST /api/jobs/:id/apply` - Apply for job

### AI
- `POST /api/ai/recommend/shelter` - Get shelter recommendations
- `POST /api/ai/recommend/jobs` - Get job recommendations
- `POST /api/ai/recommend/training` - Get training recommendations
- `POST /api/ai/analyze-notes` - Analyze volunteer notes
- `GET /api/ai/risk-score/:id` - Get risk assessment
- `POST /api/ai/chatbot` - Chat with AI bot

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/individual/:id` - Get documents
- `DELETE /api/documents/:id` - Delete document

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/progress/:id` - Individual progress
- `GET /api/analytics/success-metrics` - Success metrics
- `GET /api/analytics/export` - Export report

## 🔄 Real-Time Events

### Server → Client

- `shelter_update` - Shelter capacity changed
- `new_individual` - New individual registered
- `job_placement` - Job placement successful
- `recommendation_ready` - AI recommendations ready
- `emergency_alert` - Emergency notification
- `chat_message` - New chat message

### Client → Server

- `join_room` - Join a room
- `leave_room` - Leave a room
- `send_message` - Send chat message
- `update_location` - Update user location

## 🎯 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error message"]
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "data": [...],
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🛡️ Error Handling

### Automatic Handling

- **401 Unauthorized** → Redirect to login
- **403 Forbidden** → Show access denied message
- **422 Validation Error** → Parse and display field errors
- **500 Server Error** → Show generic error message
- **Network Error** → Show connection error

### Manual Handling

```tsx
try {
  await api.createIndividual(data);
} catch (error) {
  const apiError = error as ApiError;
  
  if (ErrorHandler.isValidationError(apiError)) {
    // Handle validation errors
    ErrorHandler.handleValidationErrors(apiError.errors!, setFieldError);
  } else {
    // Show generic error
    alert(ErrorHandler.getUserFriendlyMessage(apiError));
  }
}
```

## 🧪 Testing

### Test API Connection

```bash
# Terminal 1: Start Flask
cd backend
python app.py

# Terminal 2: Start Next.js
cd frontend
npm run dev

# Browser: Visit demo page
http://localhost:3000/api-demo
```

### Test Socket.IO

Open browser console and look for:
```
✅ Connected to Flask backend via Socket.io
```

### Test Endpoints

Use the demo page at `/api-demo` to test:
- ✅ Fetching data
- ✅ Creating records
- ✅ Pagination
- ✅ File uploads
- ✅ Real-time updates

## 📖 Documentation

- **API Integration Guide**: `API_INTEGRATION_GUIDE.md`
- **Flask Setup Guide**: `backend/FLASK_API_SETUP.md`
- **Design System**: `DESIGN_SYSTEM.md`
- **Offline Support**: `hooks/useOffline.ts`

## 🔧 Troubleshooting

### CORS Errors

Ensure Flask CORS is configured:
```python
from flask_cors import CORS
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
```

### Socket Connection Failed

1. Check Flask-SocketIO is installed
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check firewall settings
4. Ensure WebSocket transport is enabled

### Authentication Issues

1. Check token is stored in localStorage
2. Verify JWT secret keys match
3. Check token expiration time
4. Ensure Authorization header format: `Bearer TOKEN`

### Network Errors

1. Verify backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` environment variable
3. Test backend directly with curl
4. Check browser network tab for errors

## 🎓 Best Practices

1. **Always handle errors** - Use try/catch blocks
2. **Show loading states** - Use loading indicators
3. **Validate input** - Client-side validation before API calls
4. **Optimize requests** - Use pagination for large datasets
5. **Cache data** - Consider React Query or SWR
6. **Secure tokens** - Store auth tokens securely
7. **Handle offline** - Use offline detection hooks
8. **Test thoroughly** - Test all API endpoints
9. **Monitor performance** - Track API response times
10. **Log errors** - Implement proper error logging

## 🚀 Next Steps

1. ✅ Review the API integration guide
2. ✅ Test the demo page at `/api-demo`
3. ✅ Implement Flask backend endpoints
4. ✅ Test real-time Socket.IO events
5. ✅ Add authentication flow
6. ✅ Implement error boundaries
7. ✅ Add loading states to all pages
8. ✅ Test offline functionality
9. ✅ Add unit tests
10. ✅ Deploy to production

## 💡 Tips

- All API methods are fully typed with TypeScript
- Hooks automatically handle loading and error states
- Socket.IO reconnects automatically on disconnect
- File uploads show progress automatically
- Errors are logged to console in development
- All responses follow Flask standard format
- Pagination hooks manage page state automatically
- Real-time events are cleaned up on unmount

## 🐛 Known Issues

None currently. Report issues in the project repository.

## 📝 License

This integration is part of the Homeless Aid Platform project.
