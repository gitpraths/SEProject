# Design Document

## Overview

This design document outlines the implementation of an improved walk-in resident creation flow for the Shelter interface. The enhancement provides shelter staff with a streamlined, user-friendly form to quickly register walk-in residents with optional photo capture and intake notes. The solution integrates seamlessly with the existing shelter module architecture, maintaining consistency with the cream/beige theme and ensuring immediate data persistence through MSW handlers and React Query cache invalidation.

### Key Design Goals

1. **Minimal Friction**: Reduce the number of required fields to essential information only (name, age, gender)
2. **Optional Enrichment**: Allow staff to optionally add photos and intake notes without blocking submission
3. **Immediate Feedback**: Provide instant visual confirmation and automatic list updates
4. **Consistent UX**: Match existing shelter interface design patterns and animations
5. **Offline Support**: Queue actions when offline for later synchronization
6. **Type Safety**: Maintain full TypeScript type safety throughout the flow

## Architecture

### Component Hierarchy

```
AddResidentModal (existing)
└── WalkInForm (new)
    ├── React Hook Form (validation)
    ├── Zod Schema (type validation)
    ├── Photo Upload Component (base64 conversion)
    └── Submit Handler (API integration)
```

### Data Flow

```
User Input → Form Validation → Base64 Conversion (photo) → API Call → MSW Handler → 
localStorage Update → React Query Invalidation → UI Refresh → Activity Log
```

### Integration Points

1. **Type System** (`lib/types.ts`): Extend `ShelterResident` interface
2. **API Layer** (`lib/api.ts`): Add `createWalkInResident` function
3. **MSW Handlers** (`mocks/handlers/shelterResidentsHandlers.ts`): Add POST handler for walk-in endpoint
4. **Modal Component** (`components/AddResidentModal.tsx`): Replace form content with `WalkInForm`
5. **Residents Page** (`app/(shelter)/shelter/residents/page.tsx`): Ensure query invalidation triggers refresh

## Components and Interfaces

### 1. Enhanced Type Definition

**File**: `frontend/lib/types.ts`

**Changes**:
```typescript
export type ShelterResident = {
  id: string
  shelterId: string
  ngoProfileId?: string | null
  name: string
  alias?: string
  age?: number
  gender?: string
  photoUrl?: string | null  // DEPRECATED - use photo instead
  photo?: string | null     // NEW: base64 encoded image
  admittedAt: string
  bedNumber?: string | null
  medicalSummary?: string
  notes?: string            // NEW: intake notes
  health?: string
  skills?: string
  needs?: string
}
```

**Rationale**: 
- Add `photo` field for base64-encoded images (more flexible than URLs for walk-ins)
- Add `notes` field for quick intake observations
- Make `bedNumber` optional (can be assigned later)
- Keep existing fields for backward compatibility

### 2. WalkInForm Component

**File**: `frontend/components/Shelter/residents/WalkInForm.tsx`

**Props Interface**:
```typescript
interface WalkInFormProps {
  onClose: () => void
}
```

**Form Schema** (Zod):
```typescript
const walkInSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required',
  }),
  photo: z.string().optional(),  // base64 string
  notes: z.string().optional(),
})

type WalkInFormData = z.infer<typeof walkInSchema>
```

**State Management**:
```typescript
const [photoPreview, setPhotoPreview] = useState<string | null>(null)
const [isUploading, setIsUploading] = useState(false)
```

**Key Features**:
- React Hook Form with Zod validation
- File input with image preview
- Base64 conversion utility
- Loading states during submission
- Error handling with toast notifications
- Automatic modal close on success

**Photo Upload Flow**:
1. User selects image file
2. Validate file type (jpg, jpeg, png, gif) and size (<5MB)
3. Convert to base64 using FileReader API
4. Display preview with remove option
5. Include base64 string in form submission

### 3. API Function

**File**: `frontend/lib/api.ts`

**Function Signature**:
```typescript
export async function createWalkInResident(payload: {
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  shelterId: string
  photo?: string
  notes?: string
}): Promise<ShelterResident | { queued: true }> {
  return shelterApiRequest<ShelterResident>(
    '/api/shelter/residents/walkin',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'create_walkin_resident'
  )
}
```

**Rationale**:
- Uses existing `shelterApiRequest` wrapper for offline support
- Returns union type to handle queued actions
- Dedicated endpoint distinguishes walk-ins from request-based admissions

### 4. MSW Handler

**File**: `frontend/mocks/handlers/shelterResidentsHandlers.ts`

**New Handler**:
```typescript
http.post('/api/shelter/residents/walkin', async ({ request }) => {
  const body = await request.json()
  const { name, age, gender, shelterId, photo, notes } = body

  // Get existing residents
  const stored = localStorage.getItem('mock_shelter_residents')
  const residents = stored ? JSON.parse(stored) : []

  // Create new resident
  const newResident: ShelterResident = {
    id: crypto.randomUUID(),
    shelterId,
    name,
    age,
    gender,
    admittedAt: new Date().toISOString(),
    bedNumber: null,  // Assigned later
    photo: photo || null,
    notes: notes || null,
  }

  // Append and save
  residents.push(newResident)
  localStorage.setItem('mock_shelter_residents', JSON.stringify(residents))

  // Update bed stats
  updateBedOccupancy(shelterId, 1)

  return HttpResponse.json({
    success: true,
    resident: newResident,
  })
})
```

**Helper Function**:
```typescript
function updateBedOccupancy(shelterId: string, delta: number) {
  const statsKey = 'mock_shelter_bed_stats'
  const stored = localStorage.getItem(statsKey)
  const stats = stored ? JSON.parse(stored) : {}
  
  if (!stats[shelterId]) {
    stats[shelterId] = { totalBeds: 50, occupiedBeds: 0 }
  }
  
  stats[shelterId].occupiedBeds += delta
  localStorage.setItem(statsKey, JSON.stringify(stats))
}
```

### 5. Updated AddResidentModal

**File**: `frontend/components/AddResidentModal.tsx`

**Changes**:
```typescript
import { WalkInForm } from './Shelter/residents/WalkInForm'

export function AddResidentModal({ isOpen, onClose }: AddResidentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div /* backdrop */ />
          <motion.div /* modal container */>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-deepbrown dark:text-dark-text">
                Add Walk-In Resident
              </h2>
              <button onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <WalkInForm onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Rationale**: Simplify modal to be a container for the form component

## Data Models

### ShelterResident (Enhanced)

```typescript
{
  id: string                    // UUID generated by MSW
  shelterId: string             // From session
  name: string                  // Required
  age: number                   // Required
  gender: 'Male'|'Female'|'Other' // Required
  admittedAt: string            // ISO timestamp (auto-generated)
  bedNumber: string | null      // Optional, assigned later
  photo: string | null          // Base64 encoded image
  notes: string | null          // Intake observations
  ngoProfileId?: string | null  // For request-based admissions
  alias?: string                // Optional
  photoUrl?: string | null      // Legacy field
  medicalSummary?: string       // Added later
  health?: string               // From profile
  skills?: string               // From profile
  needs?: string                // From profile
}
```

### Form Data Structure

```typescript
{
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  photo?: string  // base64
  notes?: string
}
```

### API Request Payload

```typescript
{
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  shelterId: string  // From session
  photo?: string
  notes?: string
}
```

### API Response

```typescript
{
  success: true
  resident: ShelterResident
}
```

## Error Handling

### Validation Errors

**Client-Side** (Zod):
- Empty name → "Name must be at least 2 characters"
- Invalid age → "Age must be between 1 and 120"
- Missing gender → "Gender is required"
- File too large → "Image must be less than 5MB"
- Invalid file type → "Please select a valid image file (jpg, png, gif)"

**Display**: Red text below field with smooth fade-in animation

### API Errors

**Network Failure**:
```typescript
catch (error) {
  toast.error('Failed to add resident. Please try again.')
  console.error('Walk-in creation error:', error)
}
```

**Offline Mode**:
```typescript
if (data.queued) {
  toast.success('Resident will be added when online')
  logShelterActivity('Queued walk-in resident creation (offline)')
}
```

### Photo Upload Errors

**File Size**:
```typescript
if (file.size > 5 * 1024 * 1024) {
  toast.error('Image must be less than 5MB')
  return
}
```

**File Type**:
```typescript
if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
  toast.error('Please select a valid image file')
  return
}
```

**Conversion Error**:
```typescript
reader.onerror = () => {
  toast.error('Failed to process image')
  setIsUploading(false)
}
```

## Testing Strategy

### Unit Tests

**WalkInForm Component**:
- ✓ Renders all required fields
- ✓ Validates name length
- ✓ Validates age range
- ✓ Requires gender selection
- ✓ Handles photo upload
- ✓ Converts image to base64
- ✓ Displays photo preview
- ✓ Removes photo on click
- ✓ Submits valid form data
- ✓ Shows validation errors
- ✓ Disables submit during loading
- ✓ Closes modal on success

**API Function**:
- ✓ Sends POST request to correct endpoint
- ✓ Includes all required fields
- ✓ Handles success response
- ✓ Handles error response
- ✓ Queues action when offline

**MSW Handler**:
- ✓ Creates resident with UUID
- ✓ Sets admittedAt timestamp
- ✓ Stores in localStorage
- ✓ Updates bed occupancy
- ✓ Returns success response
- ✓ Preserves existing residents

### Integration Tests

**End-to-End Flow**:
1. Open residents page
2. Click "Add Resident" button
3. Fill in required fields
4. Upload photo (optional)
5. Add intake notes (optional)
6. Submit form
7. Verify modal closes
8. Verify resident appears in list
9. Verify dashboard stats update
10. Verify activity log entry

**Offline Scenario**:
1. Disconnect network
2. Add walk-in resident
3. Verify queued message
4. Reconnect network
5. Verify resident syncs
6. Verify appears in list

### Manual Testing Checklist

- [ ] Form validation works for all fields
- [ ] Photo upload accepts valid images
- [ ] Photo upload rejects invalid files
- [ ] Photo preview displays correctly
- [ ] Photo can be removed and re-uploaded
- [ ] Form submits with only required fields
- [ ] Form submits with all fields
- [ ] Success toast appears
- [ ] Modal closes automatically
- [ ] Resident appears in list immediately
- [ ] Dashboard occupancy updates
- [ ] Activity log records action
- [ ] Offline mode queues action
- [ ] Theme matches existing UI
- [ ] Animations are smooth
- [ ] Mobile responsive

## UI Design Specifications

### Color Palette

```css
--cream-bg: #FFF8E7
--white-card: #FFFFFF
--tan-hover: #F5E6D3
--brown-text: #4A3728
--brown-border: #D4C4B0
--amber-primary: #D97706
--brown-primary: #92400E
--red-error: #DC2626
```

### Component Styling

**Modal Container**:
```css
background: #FFF8E7
border-radius: 1.5rem
padding: 1.5rem
max-width: 42rem
max-height: 90vh
overflow-y: auto
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

**Input Fields**:
```css
background: #FFFFFF
border: 1px solid #D4C4B0
border-radius: 0.75rem
padding: 0.5rem 1rem
transition: all 0.2s
focus:ring-2 ring-amber
```

**Photo Preview**:
```css
width: 100%
max-height: 12rem
object-fit: cover
border-radius: 0.75rem
border: 2px solid #D4C4B0
```

**Submit Button**:
```css
background: #D97706
color: white
border-radius: 0.75rem
padding: 0.5rem 1rem
hover:background: #92400E
disabled:opacity: 0.5
transition: all 0.2s
```

### Animations

**Modal Entry**:
```typescript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.2 }}
```

**Photo Preview Fade**:
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

**Error Message**:
```typescript
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2 }}
```

### Responsive Breakpoints

- **Mobile** (<640px): Single column, full-width inputs
- **Tablet** (640px-1024px): Single column, constrained width
- **Desktop** (>1024px): Optimized modal size, two-column layout for age/gender

## Implementation Notes

### Photo Handling

**Base64 Conversion**:
```typescript
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
```

**Usage in Component**:
```typescript
const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image must be less than 5MB')
    return
  }

  setIsUploading(true)
  try {
    const base64 = await convertToBase64(file)
    setPhotoPreview(base64)
    form.setValue('photo', base64)
  } catch (error) {
    toast.error('Failed to process image')
  } finally {
    setIsUploading(false)
  }
}
```

### Session Management

**Get Shelter ID**:
```typescript
const getShelterId = (): string => {
  const session = localStorage.getItem('session')
  if (!session) throw new Error('No session found')
  const user = JSON.parse(session)
  return user.shelterId
}
```

**Usage in Form**:
```typescript
const onSubmit = async (data: WalkInFormData) => {
  try {
    const shelterId = getShelterId()
    const result = await createWalkInResident({
      ...data,
      shelterId,
    })
    
    if ('queued' in result) {
      toast.success('Resident will be added when online')
    } else {
      toast.success(`${data.name} added successfully!`)
      logShelterActivity(`Added walk-in resident: ${data.name}`)
    }
    
    queryClient.invalidateQueries(['shelter-residents', shelterId])
    queryClient.invalidateQueries(['shelter-stats', shelterId])
    onClose()
  } catch (error) {
    toast.error('Failed to add resident')
  }
}
```

### Query Invalidation

**Affected Queries**:
1. `['shelter-residents', shelterId]` - Residents list
2. `['shelter-stats', shelterId]` - Dashboard bed occupancy
3. `['shelter-dashboard', shelterId]` - Recent admissions

**Implementation**:
```typescript
queryClient.invalidateQueries({ 
  queryKey: ['shelter-residents', shelterId] 
})
queryClient.invalidateQueries({ 
  queryKey: ['shelter-stats', shelterId] 
})
```

### Activity Logging

**Log Entry**:
```typescript
logShelterActivity(`Added walk-in resident: ${data.name}`, {
  residentId: result.resident.id,
  residentName: data.name,
  action: 'create_walkin',
})
```

**Log Format**:
```typescript
{
  id: string
  timestamp: string
  category: 'shelter'
  action: string
  metadata: {
    residentId: string
    residentName: string
    action: string
  }
}
```

## Security Considerations

### Input Validation

- **Name**: Sanitize to prevent XSS (strip HTML tags)
- **Age**: Enforce numeric range (1-120)
- **Gender**: Enum validation (only allowed values)
- **Photo**: Validate file type and size before conversion
- **Notes**: Sanitize to prevent XSS

### Data Storage

- **localStorage**: Used for MSW mock data only (development)
- **Production**: Replace with secure backend API
- **Photos**: Base64 encoding increases payload size (consider compression)

### Authentication

- **Session Check**: Verify shelter role before allowing access
- **Shelter ID**: Extract from authenticated session
- **Token**: Include in API requests (handled by `shelterApiRequest`)

## Performance Considerations

### Photo Optimization

**Compression** (future enhancement):
```typescript
const compressImage = async (base64: string, maxWidth: number = 800): Promise<string> => {
  // Create image element
  const img = new Image()
  img.src = base64
  
  await new Promise((resolve) => {
    img.onload = resolve
  })
  
  // Calculate dimensions
  let width = img.width
  let height = img.height
  
  if (width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }
  
  // Draw to canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  
  // Return compressed base64
  return canvas.toDataURL('image/jpeg', 0.8)
}
```

### Query Optimization

- **Selective Invalidation**: Only invalidate affected queries
- **Optimistic Updates**: Consider adding optimistic UI updates
- **Debouncing**: Not needed (single submission)

### Bundle Size

- **React Hook Form**: Already included (~24KB)
- **Zod**: Already included (~13KB)
- **New Code**: ~5KB (WalkInForm component)
- **Total Impact**: Minimal

## Accessibility

### Keyboard Navigation

- Tab order: Name → Age → Gender → Photo → Notes → Cancel → Submit
- Enter key submits form
- Escape key closes modal
- Focus trap within modal

### Screen Readers

```tsx
<label htmlFor="name" className="...">
  Full Name <span aria-label="required">*</span>
</label>
<input
  id="name"
  aria-required="true"
  aria-invalid={!!errors.name}
  aria-describedby={errors.name ? "name-error" : undefined}
  {...register('name')}
/>
{errors.name && (
  <p id="name-error" role="alert" className="text-red-500">
    {errors.name.message}
  </p>
)}
```

### ARIA Labels

- Modal: `role="dialog"` `aria-labelledby="modal-title"`
- Form: `aria-label="Add walk-in resident form"`
- Photo input: `aria-label="Upload resident photo"`
- Submit button: `aria-busy={isSubmitting}`

## Future Enhancements

### Phase 2 Features

1. **Barcode Scanning**: Scan ID cards for auto-fill
2. **Photo Capture**: Use device camera instead of file upload
3. **Duplicate Detection**: Warn if similar resident exists
4. **Bed Assignment**: Suggest available beds during creation
5. **Bulk Import**: CSV upload for multiple walk-ins
6. **Print Badge**: Generate printable resident badge
7. **QR Code**: Generate QR code for resident tracking

### Technical Improvements

1. **Image Compression**: Reduce base64 payload size
2. **Progressive Upload**: Upload photo separately from form data
3. **Offline Queue UI**: Show pending actions in UI
4. **Form Autosave**: Save draft to localStorage
5. **Undo Action**: Allow reverting recent additions
6. **Audit Trail**: Track all changes to resident records

