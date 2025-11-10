# API Integration Guide

## Overview

This guide explains how to use the API integration between the Next.js frontend and Flask backend.

## Setup

### 1. Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

### 2. Install Dependencies

```bash
cd frontend
npm install axios socket.io-client
```

## API Client Usage

### Basic API Calls

```tsx
import { api } from '@/utils/api';

// Login
const response = await api.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get individuals
const individuals = await api.getAllIndividuals({ page: 1, limit: 10 });

// Create individual
const newIndividual = await api.createIndividual({
  name: 'John Doe',
  age: 35,
  // ... other fields
});

// Upload document
await api.uploadDocument(
  file,
  individualId,
  'id_proof',
  (progress) => console.log(`Upload: ${progress}%`)
);
```

### Using React Hooks

#### 1. Fetching Data

```tsx
'use client';

import { useFetch } from '@/hooks/useApi';
import { api } from '@/utils/api';

export default function IndividualsList() {
  const { data, loading, error, execute } = useFetch(
    () => api.getAllIndividuals({ page: 1, limit: 10 })
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={execute}>Refresh</button>
      {data?.data?.map((individual) => (
        <div key={individual.id}>{individual.name}</div>
      ))}
    </div>
  );
}
```

#### 2. Mutations (Create, Update, Delete)

```tsx
'use client';

import { useMutation } from '@/hooks/useApi';
import { api } from '@/utils/api';
import { Button, Input, Alert } from '@/components/UI';

export default function CreateIndividualForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });

  const { execute, loading, error } = useMutation(
    (data) => api.createIndividual(data),
    {
      onSuccess: (data) => {
        console.log('Individual created:', data);
        // Redirect or show success message
      },
      onError: (error) => {
        console.error('Failed to create individual:', error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error.message}</Alert>}
      
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <Input
        label="Age"
        type="number"
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      
      <Button type="submit" isLoading={loading}>
        Create Individual
      </Button>
    </form>
  );
}
```

#### 3. Pagination

```tsx
'use client';

import { usePagination } from '@/hooks/useApi';
import { api } from '@/utils/api';
import { Button, Card } from '@/components/UI';

export default function PaginatedList() {
  const {
    data,
    loading,
    error,
    page,
    pages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination((params) => api.getAllIndividuals(params), {
    initialPage: 1,
    initialLimit: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="space-y-4">
        {data.map((individual) => (
          <Card key={individual.id}>
            <h3>{individual.name}</h3>
            <p>{individual.email}</p>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={prevPage} disabled={!hasPrev}>
          Previous
        </Button>
        <span>Page {page} of {pages}</span>
        <Button onClick={nextPage} disabled={!hasNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
```

#### 4. File Upload with Progress

```tsx
'use client';

import { useState } from 'react';
import { useUpload } from '@/hooks/useApi';
import { Button, ProgressBar, Alert } from '@/components/UI';

export default function DocumentUpload({ individualId }: { individualId: number }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, progress, loading, error } = useUpload();

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await upload(selectedFile, individualId, 'id_proof');
      alert('Upload successful!');
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert variant="danger">{error.message}</Alert>}

      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="input"
      />

      {loading && (
        <ProgressBar
          value={progress}
          label="Uploading..."
          showPercentage
          variant="primary"
        />
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        isLoading={loading}
      >
        Upload Document
      </Button>
    </div>
  );
}
```

## Real-Time Updates with Socket.IO

### 1. Basic Socket Usage

```tsx
'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function RealtimeComponent() {
  const { socket, on, off, emit, isConnected } = useSocket({
    autoConnect: true,
    room: 'dashboard',
  });

  useEffect(() => {
    // Listen for events
    on('shelter_update', (data) => {
      console.log('Shelter updated:', data);
    });

    // Cleanup
    return () => {
      off('shelter_update');
    };
  }, [on, off]);

  const sendMessage = () => {
    emit('send_message', { message: 'Hello from frontend!' });
  };

  return (
    <div>
      <p>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}
```

### 2. Shelter Updates

```tsx
'use client';

import { useState } from 'react';
import { useShelterUpdates } from '@/hooks/useSocket';
import { Card, Badge } from '@/components/UI';

export default function ShelterDashboard() {
  const [shelters, setShelters] = useState([]);

  useShelterUpdates((data) => {
    // Update shelter capacity in real-time
    setShelters((prev) =>
      prev.map((shelter) =>
        shelter.id === data.shelter_id
          ? { ...shelter, available_beds: data.available_beds }
          : shelter
      )
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {shelters.map((shelter) => (
        <Card key={shelter.id}>
          <h3>{shelter.name}</h3>
          <Badge variant={shelter.available_beds > 0 ? 'secondary' : 'danger'}>
            {shelter.available_beds} beds available
          </Badge>
        </Card>
      ))}
    </div>
  );
}
```

### 3. Emergency Alerts

```tsx
'use client';

import { useEmergencyAlerts } from '@/hooks/useSocket';
import { Alert } from '@/components/UI';
import { useState } from 'react';

export default function EmergencyAlertBanner() {
  const [alert, setAlert] = useState<any>(null);

  useEmergencyAlerts((data) => {
    setAlert(data);
    // Auto-dismiss after 10 seconds
    setTimeout(() => setAlert(null), 10000);
  });

  if (!alert) return null;

  return (
    <Alert variant="danger" onClose={() => setAlert(null)}>
      <strong>🚨 Emergency Alert:</strong> {alert.message}
    </Alert>
  );
}
```

### 4. Chat Messages

```tsx
'use client';

import { useState } from 'react';
import { useChatMessages } from '@/hooks/useSocket';
import { Button, Input } from '@/components/UI';

export default function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useChatMessages((data) => {
    setMessages((prev) => [...prev, data]);
  }, roomId);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Emit message through socket
    socketClient.sendMessage(newMessage, roomId);
    setNewMessage('');
  };

  return (
    <div className="space-y-4">
      <div className="h-96 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-neutral-100 rounded">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
```

## Error Handling

### 1. Global Error Handler

```tsx
import { ErrorHandler, ApiError } from '@/utils/errorHandler';

try {
  await api.createIndividual(data);
} catch (error) {
  const apiError = error as ApiError;
  
  // Get error type
  const errorType = ErrorHandler.getErrorType(apiError);
  
  // Get user-friendly message
  const message = ErrorHandler.getUserFriendlyMessage(apiError);
  
  // Handle validation errors
  if (ErrorHandler.isValidationError(apiError)) {
    ErrorHandler.handleValidationErrors(apiError.errors!, setFieldError);
  }
}
```

### 2. Retry Failed Requests

```tsx
import { api } from '@/utils/api';

const fetchWithRetry = async () => {
  return api.retryRequest(
    () => api.getAllIndividuals(),
    3, // retries
    1000 // delay in ms
  );
};
```

## Flask Backend Requirements

Your Flask backend should implement these endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Individuals
- `GET /api/individuals`
- `GET /api/individuals/:id`
- `POST /api/individuals`
- `PUT /api/individuals/:id`
- `DELETE /api/individuals/:id`
- `GET /api/individuals/search`

### Shelters
- `GET /api/shelters`
- `GET /api/shelters/available`
- `GET /api/shelters/:id`
- `PATCH /api/shelters/:id/capacity`

### Jobs
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `POST /api/jobs/:id/apply`

### AI
- `POST /api/ai/recommend/shelter`
- `POST /api/ai/recommend/jobs`
- `POST /api/ai/recommend/training`
- `POST /api/ai/analyze-notes`
- `GET /api/ai/risk-score/:id`
- `POST /api/ai/chatbot`

### Documents
- `POST /api/documents/upload`
- `GET /api/documents/individual/:id`
- `DELETE /api/documents/:id`

### Analytics
- `GET /api/analytics/dashboard`
- `GET /api/analytics/progress/:id`
- `GET /api/analytics/success-metrics`
- `GET /api/analytics/export`

### Response Format

All Flask endpoints should return:

```python
# Success
{
  "success": True,
  "data": {...},
  "message": "Operation successful"
}

# Error
{
  "success": False,
  "message": "Error message",
  "errors": {...}  # For validation errors
}
```

### CORS Configuration

```python
from flask_cors import CORS

CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
```

### Socket.IO Configuration

```python
from flask_socketio import SocketIO, emit

socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
```

## Testing

### Test API Connection

```bash
# Start Flask backend
cd backend
python app.py

# Start Next.js frontend
cd frontend
npm run dev

# Visit http://localhost:3000
```

### Test Socket.IO

Open browser console and check for:
```
✅ Connected to Flask backend via Socket.io
```

## Troubleshooting

### CORS Errors
- Ensure Flask CORS is configured correctly
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Socket Connection Issues
- Verify Flask-SocketIO is installed
- Check firewall settings
- Ensure WebSocket transport is enabled

### Authentication Issues
- Check token is stored in localStorage
- Verify token format in Flask backend
- Check token expiration

## Best Practices

1. **Always handle errors** - Use try/catch blocks
2. **Show loading states** - Use loading indicators
3. **Validate input** - Client-side validation before API calls
4. **Optimize requests** - Use pagination for large datasets
5. **Cache data** - Use React Query or SWR for caching
6. **Secure tokens** - Store auth tokens securely
7. **Handle offline** - Use offline detection hooks
8. **Test thoroughly** - Test all API endpoints
