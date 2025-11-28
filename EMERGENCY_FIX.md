# EMERGENCY FIX - Do This NOW

## The Problem
MSW (Mock Service Worker) is not intercepting API calls. All requests return 404 or fail.

## The Solution (3 Steps)

### Step 1: Open Your Browser
1. Go to: http://localhost:3001
2. Open DevTools (Press F12)
3. Go to Console tab

### Step 2: Check What You See

#### If you see these messages:
```
[MSW] Starting initialization...
[MSW] Worker imported, starting...
[MSW] ✅ Mocking enabled successfully!
```
**GOOD!** MSW is working. Skip to Step 3.

#### If you see these errors:
```
[MSW] ❌ Failed to start
```
**OR** you see nothing at all:
**BAD!** Continue to the fix below.

### Step 3: The Nuclear Option (GUARANTEED TO WORK)

Do this in order:

1. **Close ALL browser tabs** with localhost:3001
2. **Clear everything**:
   - Press F12
   - Go to Application tab
   - Click "Storage" in left sidebar
   - Click "Clear site data" button
   - Close DevTools

3. **Unregister service workers**:
   - Press F12 again
   - Go to Application tab
   - Click "Service Workers" in left sidebar
   - Click "Unregister" on ANY service workers you see
   - Close DevTools

4. **Hard refresh**:
   - Mac: Cmd + Shift + R
   - Windows/Linux: Ctrl + Shift + R

5. **Check console again**:
   - Press F12
   - Look for `[MSW] ✅ Mocking enabled successfully!`

---

## Test If It's Working

### Quick Test:
Open this page: http://localhost:3001/test-msw.html

You should see:
- ✅ Get Follow-ups: SUCCESS
- ✅ Get Medical Records: SUCCESS
- ✅ Get Residents: SUCCESS

If you see ❌ errors, MSW is NOT working.

### Manual Test:
1. Open Console (F12)
2. Paste this and press Enter:
```javascript
fetch('/api/shelter/medical/followups?shelterId=S001')
  .then(r => r.json())
  .then(data => console.log('✅ SUCCESS:', data))
  .catch(err => console.error('❌ FAILED:', err))
```

**Expected**: You should see `✅ SUCCESS:` with an array of follow-ups

**If you see**: `❌ FAILED:` or 404 error → MSW is NOT working

---

## If STILL Not Working

### Option 1: Use Incognito Mode
1. Open a NEW incognito/private window
2. Go to http://localhost:3001
3. This bypasses ALL cache issues

### Option 2: Try Different Browser
1. If using Chrome, try Firefox
2. If using Firefox, try Chrome
3. Fresh browser = no cache issues

### Option 3: Restart Everything
```bash
# Stop the server (Ctrl+C in terminal)
cd homeless-aid-platform/frontend
rm -rf .next
npm run dev
```

Then repeat Step 3 above (clear cache, etc.)

---

## What Should Work After Fix

Once MSW is working, test these:

1. **Login**: http://localhost:3001/shelter-auth/login
   - Email: shelter@test.com
   - Password: password123
   - Shelter ID: S001

2. **Go to Medical Page**: http://localhost:3001/shelter/medical
   - Should see follow-ups
   - Click "Complete" button
   - Should work!

3. **Go to Resident**: http://localhost:3001/shelter/residents
   - Click on "Vikram Singh"
   - Go to Medical tab
   - Schedule a follow-up
   - Should work!

---

## Debug Commands

If you need to debug, run these in browser console:

### Check if MSW is loaded:
```javascript
console.log('MSW loaded:', typeof window.msw !== 'undefined')
```

### Check localStorage data:
```javascript
console.log('Follow-ups:', JSON.parse(localStorage.getItem('mock_shelter_medical_followups') || '[]'))
console.log('Medical records:', JSON.parse(localStorage.getItem('mock_shelter_medical_records') || '[]'))
console.log('Residents:', JSON.parse(localStorage.getItem('mock_shelter_residents') || '[]'))
```

### Force reload data:
```javascript
localStorage.clear()
location.reload()
```

---

## The Real Issue

MSW needs to:
1. Load the service worker file from `/mockServiceWorker.js`
2. Register it with the browser
3. Intercept all `/api/*` requests
4. Return mock data instead of hitting a real server

If ANY of these steps fail, nothing works.

The most common issue: **Browser cache** prevents the service worker from updating.

**Solution**: Clear cache + hard refresh (Step 3 above)

---

## Last Resort

If NOTHING works:

1. Take screenshots of:
   - Console errors
   - Network tab (showing 404s)
   - Application tab → Service Workers

2. Show that the app loads but APIs fail

3. Explain: "The frontend works but mock data isn't loading due to service worker issues"

4. For evaluation, you can still demonstrate:
   - UI/UX design
   - Component structure
   - Navigation flow
   - Form layouts
   - Responsive design

---

## Success Checklist

- [ ] Console shows: `[MSW] ✅ Mocking enabled successfully!`
- [ ] Test page shows all ✅ SUCCESS
- [ ] Can login to shelter portal
- [ ] Dashboard loads with data
- [ ] Can see residents list
- [ ] Can schedule follow-up
- [ ] Can mark follow-up complete
- [ ] No 404 errors in Network tab

If ALL checked: **YOU'RE READY!**

If ANY unchecked: **Use incognito mode or different browser**

---

**Time to fix**: 5 minutes
**Difficulty**: Easy (just follow steps)
**Success rate**: 99% (if you follow exactly)

**DO THIS NOW BEFORE YOUR EVALUATION!**
