# API Endpoints Testing Guide

## How to Test in Browser Console

Open your browser console (F12) and run these commands to test each endpoint:

### 1. Test Follow-up Scheduling
```javascript
// Schedule a new follow-up
fetch('/api/shelter/medical/followups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recordId: 'med1',
    residentId: 'res1',
    residentName: 'Vikram Singh',
    shelterId: 'S001',
    date: '2025-11-29',
    notes: 'Test follow-up'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Follow-up created:', data))
.catch(err => console.error('❌ Error:', err))
```

### 2. Test Get Follow-ups
```javascript
// Get all follow-ups for shelter
fetch('/api/shelter/medical/followups?shelterId=S001')
.then(r => r.json())
.then(data => console.log('✅ Follow-ups:', data))
.catch(err => console.error('❌ Error:', err))
```

### 3. Test Mark Follow-up Complete
```javascript
// Mark a follow-up as complete (replace 'fu1' with actual ID)
fetch('/api/shelter/medical/followups/fu1/complete', {
  method: 'POST'
})
.then(r => r.json())
.then(data => console.log('✅ Follow-up completed:', data))
.catch(err => console.error('❌ Error:', err))
```

### 4. Test Get Medical Records
```javascript
// Get all medical records
fetch('/api/shelter/medical')
.then(r => r.json())
.then(data => console.log('✅ Medical records:', data))
.catch(err => console.error('❌ Error:', err))
```

### 5. Test Create Medical Record
```javascript
// Create a new medical record
fetch('/api/shelter/medical', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    residentId: 'res1',
    residentName: 'Vikram Singh',
    diagnosis: 'Test Diagnosis',
    doctor: 'Dr. Test',
    notes: 'Test notes',
    date: new Date().toISOString()
  })
})
.then(r => r.json())
.then(data => console.log('✅ Medical record created:', data))
.catch(err => console.error('❌ Error:', err))
```

### 6. Test Get Residents
```javascript
// Get all residents for shelter
fetch('/api/shelter/residents?shelterId=S001')
.then(r => r.json())
.then(data => console.log('✅ Residents:', data))
.catch(err => console.error('❌ Error:', err))
```

### 7. Test Get Shelter Requests
```javascript
// Get all shelter requests
fetch('/api/shelter/requests?shelterId=S001')
.then(r => r.json())
.then(data => console.log('✅ Requests:', data))
.catch(err => console.error('❌ Error:', err))
```

### 8. Test Dashboard Stats
```javascript
// Get bed stats
fetch('/api/shelter/dashboard/bed-stats?shelterId=S001')
.then(r => r.json())
.then(data => console.log('✅ Bed stats:', data))
.catch(err => console.error('❌ Error:', err))
```

---

## Run All Tests at Once

Copy and paste this into your browser console to test all endpoints:

```javascript
async function testAllEndpoints() {
  console.log('🧪 Starting API endpoint tests...\n')
  
  const tests = [
    {
      name: 'Get Follow-ups',
      url: '/api/shelter/medical/followups?shelterId=S001',
      method: 'GET'
    },
    {
      name: 'Get Medical Records',
      url: '/api/shelter/medical',
      method: 'GET'
    },
    {
      name: 'Get Residents',
      url: '/api/shelter/residents?shelterId=S001',
      method: 'GET'
    },
    {
      name: 'Get Shelter Requests',
      url: '/api/shelter/requests?shelterId=S001',
      method: 'GET'
    },
    {
      name: 'Get Bed Stats',
      url: '/api/shelter/dashboard/bed-stats?shelterId=S001',
      method: 'GET'
    },
    {
      name: 'Get Pending Requests',
      url: '/api/shelter/dashboard/pending-requests?shelterId=S001',
      method: 'GET'
    },
    {
      name: 'Get Recent Admissions',
      url: '/api/shelter/dashboard/recent-admissions?shelterId=S001',
      method: 'GET'
    },
    {
      name: 'Get Upcoming Discharges',
      url: '/api/shelter/dashboard/upcoming-discharges?shelterId=S001',
      method: 'GET'
    }
  ]
  
  for (const test of tests) {
    try {
      const response = await fetch(test.url, { method: test.method })
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ ${test.name}: SUCCESS (${response.status})`)
        console.log('   Data:', data)
      } else {
        console.error(`❌ ${test.name}: FAILED (${response.status})`)
        console.error('   Error:', data)
      }
    } catch (error) {
      console.error(`❌ ${test.name}: ERROR`)
      console.error('   ', error)
    }
    console.log('') // Empty line for readability
  }
  
  console.log('🏁 All tests completed!')
}

testAllEndpoints()
```

---

## Expected Results

All tests should return:
- ✅ Status 200
- ✅ JSON data
- ✅ No errors in console

If you see ❌ 404 errors:
1. MSW is not running
2. Clear browser cache
3. Hard refresh the page
4. Check console for MSW initialization messages

---

## Quick Verification

Run this one-liner to check if MSW is working:

```javascript
fetch('/api/shelter/medical/followups?shelterId=S001')
  .then(r => console.log('Status:', r.status, r.ok ? '✅ MSW Working!' : '❌ MSW Not Working'))
```

Expected output: `Status: 200 ✅ MSW Working!`

If you see `Status: 404 ❌ MSW Not Working`:
- MSW service worker is not intercepting requests
- Follow the troubleshooting steps in EVALUATION_READINESS_CHECKLIST.md
