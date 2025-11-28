# UX Enhancements Implementation Guide

## Quick Reference

### 1. Update Page Headers

**Before:**
```tsx
<motion.div className="space-y-2">
  <h1 className="text-3xl font-bold">Page Title</h1>
  <p className="text-lg">Subtitle text</p>
</motion.div>
```

**After:**
```tsx
import { PageHeader } from '@/components/PageHeader'

<PageHeader
  title="Page Title"
  subtitle="Subtitle text"
  actions={<Button>Action</Button>}
/>
```

### 2. Add Page Transitions

**Wrap entire page content:**
```tsx
return (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="max-w-7xl mx-auto p-6"
  >
    {/* page content */}
  </motion.div>
)
```

### 3. Replace Empty States

**Before:**
```tsx
{items.length === 0 && (
  <div className="text-center p-12">
    <p>No items found</p>
  </div>
)}
```

**After:**
```tsx
import { EmptyState } from '@/components/EmptyState'
import { Users } from 'lucide-react'

{items.length === 0 && (
  <EmptyState
    icon={Users}
    title="No items yet"
    description="Get started by adding your first item."
    action={<Button onClick={handleAdd}>Add Item</Button>}
  />
)}
```

### 4. Use Badges

**Before:**
```tsx
<span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
  High
</span>
```

**After:**
```tsx
import { Badge } from '@/components/Badge'

<Badge label="High" variant="high" />
<Badge label={priority} variant={priority.toLowerCase()} />
```

### 5. Use Modal Component

**Before:**
```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div onClick={onClose} className="fixed inset-0 bg-black/50" />
      <motion.div className="fixed top-1/2 left-1/2 ...">
        <h2>Modal Title</h2>
        <button onClick={onClose}>X</button>
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**After:**
```tsx
import { Modal } from '@/components/Modal'

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="md"
>
  {children}
</Modal>
```

### 6. Add Scrollable Sections

**For long lists:**
```tsx
<div className="overflow-y-auto max-h-[70vh] shadow-inner shadow-brown/20 rounded-xl p-4">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>
```

### 7. Add Icon Indicators

```tsx
import { Inbox, Users, Stethoscope } from 'lucide-react'

<div className="flex items-center gap-2">
  <Inbox className="w-4 h-4 text-brown-600 dark:text-brown-400" />
  <span>Requests</span>
</div>
```

### 8. Offline Detection

```tsx
const [isOnline, setIsOnline] = useState(true)

useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

<button
  disabled={!isOnline}
  title={!isOnline ? 'You are offline — action will be queued' : ''}
  className={!isOnline ? 'opacity-50 cursor-not-allowed' : ''}
>
  Accept Request
</button>
```

## Page-by-Page Updates

### Shelter Requests Page

```tsx
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/Badge'
import { Inbox, AlertCircle } from 'lucide-react'

export default function ShelterRequestsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto p-6 space-y-6"
    >
      <PageHeader
        title="Assignment Requests"
        subtitle="Review and manage incoming resident requests from NGOs"
      />
      
      {/* Filters */}
      {/* ... */}
      
      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Requests Found"
          description={searchTerm || priorityFilter !== 'All'
            ? 'Try adjusting your filters'
            : 'No pending requests at the moment'}
        />
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {filteredRequests.map(request => (
            <div key={request.id}>
              <Badge label={request.priority} variant={request.priority.toLowerCase()} />
              {/* ... rest of card */}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
```

### Shelter Residents Page

```tsx
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/Badge'
import { Users, Plus } from 'lucide-react'

export default function ShelterResidentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto p-6 space-y-6"
    >
      <PageHeader
        title="Residents"
        subtitle="Current residents in the shelter"
        actions={
          <button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Add Resident
          </button>
        }
      />
      
      {filteredResidents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No residents yet"
          description="Click the button below to add the first resident."
          action={
            <button onClick={() => setIsAddModalOpen(true)}>
              Add Resident
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 overflow-y-auto max-h-[70vh]">
          {filteredResidents.map(resident => (
            <div key={resident.id}>
              <Badge label={resident.gender} variant={resident.gender.toLowerCase()} />
              {/* ... rest of card */}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
```

### Shelter Medical Page

```tsx
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/Badge'
import { Stethoscope, Plus } from 'lucide-react'

export default function ShelterMedicalPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto p-6 space-y-6"
    >
      <PageHeader
        title="Medical Records"
        subtitle="Manage medical records and follow-ups"
        actions={
          <button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Add Record
          </button>
        }
      />
      
      {/* Today's Follow-ups */}
      <div className="bg-cream-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-brown-600" />
          <h2 className="text-xl font-bold">Today's Follow-ups</h2>
        </div>
        
        {todaysFollowups.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No follow-ups today"
            description="All caught up!"
          />
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[40vh]">
            {todaysFollowups.map(followup => (
              <div key={followup.id}>
                <Badge
                  label={followup.completed ? 'Completed' : 'Pending'}
                  variant={followup.completed ? 'completed' : 'pending'}
                />
                {/* ... rest of card */}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

## Toast Configuration

**In `app/layout.tsx`:**

```tsx
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            success: {
              style: {
                background: '#FEF7F0',
                color: '#3C2F2F',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              iconTheme: {
                primary: '#10B981',
                secondary: '#FEF7F0',
              },
            },
            error: {
              style: {
                background: '#FEE2E2',
                color: '#991B1B',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FEE2E2',
              },
            },
            loading: {
              style: {
                background: '#FEF3C7',
                color: '#92400E',
                borderRadius: '12px',
                padding: '16px',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
```

## Common Patterns

### Priority Badge
```tsx
const getPriorityVariant = (priority: string) => {
  return priority.toLowerCase() as 'high' | 'medium' | 'low'
}

<Badge label={priority} variant={getPriorityVariant(priority)} />
```

### Gender Badge
```tsx
const getGenderVariant = (gender: string) => {
  return gender.toLowerCase() as 'male' | 'female' | 'other'
}

<Badge label={gender} variant={getGenderVariant(gender)} />
```

### Status Badge
```tsx
<Badge
  label={completed ? 'Completed' : 'Pending'}
  variant={completed ? 'completed' : 'pending'}
/>
```

## Testing Checklist

After implementing each enhancement:

- [ ] Component renders without errors
- [ ] Animations are smooth
- [ ] Dark mode works correctly
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] No console warnings
- [ ] TypeScript compiles

## Tips

1. **Import Order:** Keep imports organized (React, libraries, components, utils)
2. **Consistent Spacing:** Use the same gap/padding values across pages
3. **Color Consistency:** Use theme colors from tailwind.config
4. **Animation Timing:** Keep transitions fast (0.2-0.3s)
5. **Accessibility:** Always include aria-labels and titles
6. **Error Handling:** Show helpful messages, not technical errors
7. **Loading States:** Use skeletons, not spinners
8. **Empty States:** Make them friendly and actionable

## Conclusion

Follow this guide to systematically update all Shelter pages with the new UX components. The result will be a polished, consistent, and professional user experience.
