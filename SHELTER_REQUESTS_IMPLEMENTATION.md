# Shelter Assignment Requests Implementation

## Summary

Implemented a complete assignment request workflow for shelter staff at `/shelter/requests`. Shelter staff can view, filter, and manage NGO referrals with automatic resident creation on acceptance.

## Files Created

### 1. **frontend/components/Shelter/requests/RequestCard.tsx**
- Displays individual request in card format
- Shows:
  - Resident name with avatar
  - Gender and age
  - Priority badge (High/Medium/Low) with color coding
  - Reason preview (2 lines max)
  - Time since request
- "View Details" button
- Hover animation with scale effect
- Cream/beige card with brown text

### 2. **frontend/components/Shelter/requests/RejectModal.tsx**
- Modal for rejecting requests
- Features:
  - Warning icon and message
  - Required textarea for rejection reason
  - Cancel and Reject buttons
  - Form validation
  - Loading state during submission
- Fade + scale animation
- Prevents empty rejection reasons

### 3. **frontend/components/Shelter/requests/RequestDetailModal.tsx**
- Full-screen modal showing complete request details
- Sections:
  - Header with resident info and priority badge
  - Request information (submitted date, NGO profile ID)
  - Reason for referral
  - Health information
  - Skills & experience
  - Identified needs
- Actions:
  - Accept & Admit button (green)
  - Reject button (red)
- Opens RejectModal when rejecting
- Sticky header and footer
- Scrollable content area

### 4. **frontend/components/Shelter/requests/RequestList.tsx**
- Main list component with filtering
- Features:
  - Search by resident name
  - Priority filter dropdown (All/High/Medium/Low)
  - Grid layout (1/2/3 columns responsive)
  - Empty state with icon
  - Loading skeletons
  - Staggered animations
- Handles accept/reject actions
- Invalidates multiple queries on success
- Toast notifications for feedback

### 5. **frontend/app/(shelter)/shelter/requests/page.tsx**
- Main requests page
- Features:
  - Breadcrumb navigation
  - Page header with description
  - Uses shelter guard for protection
  - Passes shelterId to RequestList
- Clean, minimal layout

### 6. **frontend/mocks/handlers/shelterRequestHandlers.ts**
- Complete MSW handlers for request workflow
- Endpoints:
  - `GET /api/shelter/requests?shelterId={id}`
  - `POST /api/shelter/requests/:id/accept`
  - `POST /api/shelter/requests/:id/reject`
- Features:
  - localStorage-backed persistence
  - Filters by shelterId
  - On accept: Creates resident, removes request
  - On reject: Saves rejection log, removes request
  - 500-1000ms latency
  - Seeded data for S001 and S002
  - Error handling for missing requests

## Files Modified

### 1. **frontend/lib/types.ts**
Added `AssignmentRequest` type:
```typescript
export type AssignmentRequest = {
  id: string
  shelterId: string
  ngoProfileId: string
  residentName: string
  age: number
  gender: string
  reason: string
  priority: 'High' | 'Medium' | 'Low'
  createdAt: string
}
```

### 2. **frontend/lib/api.ts**
Added API wrapper functions:
```typescript
export async function fetchShelterRequests(shelterId: string)
export async function acceptShelterRequest(id: string)
export async function rejectShelterRequest(id: string, body: { reason: string })
export async function createShelterResident(payload: any)
```

## Key Features

### Data Filtering
- All requests filtered by `shelterId`
- Shelter only sees their own requests
- No cross-shelter data access

### Accept Workflow
1. User clicks "Accept & Admit"
2. Request removed from pending
3. New resident automatically created with:
   - Name, age, gender from request
   - Admission date (current timestamp)
   - Auto-assigned bed number
   - Notes including referral reason
   - Health, skills, needs info
   - NGO profile ID reference
4. Multiple queries invalidated:
   - shelter-requests
   - shelter-residents
   - shelter-bed-stats
   - shelter-recent-admissions
   - shelter-pending-requests
5. Success toast displayed
6. Dashboard updates automatically

### Reject Workflow
1. User clicks "Reject"
2. Reject modal opens
3. User must provide reason
4. Request removed from pending
5. Rejection logged with:
   - Request ID
   - Resident name
   - Rejection timestamp
   - Reason
   - Shelter ID
6. Queries invalidated
7. Success toast displayed

### Filtering & Search
- **Priority Filter**: All, High, Medium, Low
- **Search**: By resident name (case-insensitive)
- **Combined**: Both filters work together
- **Real-time**: Updates as you type/select

### UI/UX
- Warm humanitarian theme (cream/beige/brown)
- Priority color coding:
  - High: Red
  - Medium: Orange
  - Low: Blue
- Responsive grid (1/2/3 columns)
- Smooth animations (Framer Motion)
- Loading states
- Empty states
- Toast notifications
- Form validation

## Mock Data Structure

### Requests (S001)
```json
[
  {
    "id": "req1",
    "shelterId": "S001",
    "ngoProfileId": "p101",
    "residentName": "Rajesh Kumar",
    "age": 42,
    "gender": "Male",
    "reason": "Needs immediate shelter due to medical emergency...",
    "priority": "High",
    "createdAt": "2024-11-28T12:00:00Z",
    "health": "Requires regular medication for diabetes",
    "skills": "Carpentry, basic electrical work",
    "needs": "Medical care, stable housing"
  }
]
```

### Created Resident (on accept)
```json
{
  "id": "res1234567890",
  "name": "Rajesh Kumar",
  "age": 42,
  "gender": "Male",
  "admissionDate": "2024-11-28T15:30:00Z",
  "bedNumber": "B1",
  "notes": "Admitted from NGO request. Reason: Needs immediate shelter...",
  "health": "Requires regular medication for diabetes",
  "skills": "Carpentry, basic electrical work",
  "needs": "Medical care, stable housing",
  "ngoProfileId": "p101",
  "shelterId": "S001"
}
```

### Rejection Log
```json
{
  "id": "rej1234567890",
  "requestId": "req1",
  "residentName": "Rajesh Kumar",
  "rejectedAt": "2024-11-28T15:30:00Z",
  "reason": "Shelter at full capacity",
  "shelterId": "S001"
}
```

## LocalStorage Keys

- `mock_shelter_requests` - Pending requests
- `mock_shelter_residents` - Admitted residents
- `mock_shelter_rejections` - Rejection logs

## Query Invalidation

On accept or reject, the following queries are invalidated to ensure UI updates:

1. `shelter-requests` - Refresh request list
2. `shelter-residents` - Update residents list
3. `shelter-bed-stats` - Update occupancy
4. `shelter-recent-admissions` - Show new admission
5. `shelter-pending-requests` - Update dashboard count

## Acceptance Criteria ✅

- [x] Shelter sees only requests for THEIR shelter
- [x] Accept creates a resident automatically
- [x] Reject requires a reason
- [x] Priority filters work correctly
- [x] Modals animate smoothly
- [x] LocalStorage persists data
- [x] Dashboard pending count updates
- [x] Search functionality works
- [x] Responsive design
- [x] Loading states implemented
- [x] Toast notifications
- [x] Form validation
- [x] Error handling

## Testing

### View Requests
1. Login as shelter S001
2. Navigate to Requests
3. Verify 3 requests displayed
4. Check priority badges show correct colors
5. Verify time stamps are relative

### Filter by Priority
1. Select "High Priority" filter
2. Verify only high priority requests shown
3. Select "Medium Priority"
4. Verify filter updates
5. Select "All" to reset

### Search
1. Type "Rajesh" in search
2. Verify only matching requests shown
3. Clear search
4. Verify all requests return

### Accept Request
1. Click "View Details" on a request
2. Review all information
3. Click "Accept & Admit"
4. Verify success toast
5. Check request removed from list
6. Navigate to Residents
7. Verify new resident created
8. Check dashboard shows updated stats

### Reject Request
1. Click "View Details" on a request
2. Click "Reject"
3. Try submitting without reason
4. Verify validation error
5. Enter rejection reason
6. Click "Reject Request"
7. Verify success toast
8. Check request removed from list

### Different Shelters
1. Login as shelter S002
2. Navigate to Requests
3. Verify only S002 requests shown
4. Verify S001 requests not visible

## Notes

- Bed numbers auto-increment (B1, B2, B3...)
- Admission date uses current timestamp
- NGO profile ID preserved for tracking
- Rejection logs kept for audit trail
- All timestamps in ISO 8601 format
- Dark mode fully supported
- Mobile responsive with touch-friendly buttons
- Keyboard navigation supported
- Screen reader friendly with semantic HTML
