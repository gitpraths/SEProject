# Privacy & Role Display Audit

## Critical Issues Found

### 1. ❌ Volunteers Can See ALL Profiles
**Problem**: Volunteers can see all homeless profiles, not just ones they've helped
**Location**: `/profiles/all` page
**Fix Needed**: Filter profiles to show only those the volunteer has interacted with

### 2. ❌ Volunteers Can See Medical History
**Problem**: Medical history is private information that volunteers shouldn't access
**Location**: Profile detail pages show medical history tab
**Fix Needed**: Hide medical history tab for volunteers, only show to NGO staff and shelter staff

### 3. ❌ Volunteers Can See All Jobs
**Problem**: Job listings should be filtered based on role
**Location**: `/resources/jobs` page
**Fix Needed**: Volunteers should only see jobs relevant to their work

### 4. ❌ Role Not Displayed in Navbar
**Problem**: User's role (Admin, Volunteer, NGO Staff, Shelter) not shown in account section
**Location**: Navbar component
**Fix Needed**: Display role badge next to user name

### 5. ❌ No Role-Based Access Control
**Problem**: No checks to prevent unauthorized access to sensitive data
**Locations**: Multiple pages
**Fix Needed**: Add role-based guards and conditional rendering

---

## Fixes to Implement

### Fix 1: Filter Profiles for Volunteers
```typescript
// Only show profiles the volunteer has helped
if (userRole === 'Volunteer') {
  profiles = profiles.filter(p => p.assignedVolunteers?.includes(userId))
}
```

### Fix 2: Hide Medical History from Volunteers
```typescript
// In ProfileTabs component
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  // Only show medical for NGO/Shelter staff
  ...(userRole !== 'Volunteer' ? [{ id: 'medical', label: 'Medical History' }] : []),
]
```

### Fix 3: Show Role in Navbar
```typescript
// Display: "John Doe • Volunteer"
<span className="text-sm text-brown">
  {user.name} • {user.role}
</span>
```

### Fix 4: Role-Based Job Filtering
```typescript
// Volunteers see only jobs they're assigned to help with
if (userRole === 'Volunteer') {
  jobs = jobs.filter(j => j.relevantForVolunteers)
}
```

---

## Implementation Priority

1. **HIGH**: Hide medical history from volunteers
2. **HIGH**: Show role in navbar
3. **MEDIUM**: Filter profiles for volunteers
4. **MEDIUM**: Filter jobs based on role
5. **LOW**: Add role badges throughout UI

---

## Testing Checklist

- [ ] Login as Volunteer → Cannot see medical history
- [ ] Login as Volunteer → Only sees assigned profiles
- [ ] Login as NGO Staff → Can see medical history
- [ ] Login as Admin → Role shows in navbar
- [ ] Login as Shelter → Role shows in navbar
- [ ] All roles → Correct permissions enforced
