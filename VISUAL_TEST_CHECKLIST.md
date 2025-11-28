# 📸 Visual Testing Checklist

## Before You Start
- [ ] Dev server running: http://localhost:3001
- [ ] Browser cache cleared
- [ ] Console open (F12) to see MSW messages

---

## 1️⃣ MSW Verification (CRITICAL)

### What to Check:
Open browser console and look for:
```
[MSW] Setting up worker with 25 handlers
[MSW] Mocking enabled
```

### ✅ Success Indicators:
- Console shows MSW messages
- No red errors in console
- Network tab shows 200 responses (not 404)

### ❌ If You See Problems:
- No MSW messages → Clear cache and hard refresh
- 404 errors → MSW not running, restart browser
- Red errors → Check console for details

---

## 2️⃣ Login Test

### Steps:
1. Go to: http://localhost:3001/shelter-auth/login
2. Enter:
   - Email: `shelter@test.com`
   - Password: `password123`
   - Shelter ID: `S001`
3. Click "Login"

### ✅ Success Indicators:
- Redirects to dashboard
- No error messages
- Shelter name appears in navbar

### ❌ If You See Problems:
- "Invalid credentials" → Check spelling
- Stays on login page → Check console for errors

---

## 3️⃣ Dashboard Test

### What to Check:
- [ ] Bed Occupancy card shows numbers
- [ ] Pending Requests card shows count
- [ ] Recent Admissions list appears
- [ ] Upcoming Discharges list appears
- [ ] All cards load (no infinite spinners)

### ✅ Success Indicators:
- All 4 cards display data
- Numbers make sense (e.g., 15/50 beds)
- Lists show resident names
- No loading spinners stuck

---

## 4️⃣ Residents List Test

### Steps:
1. Click "Residents" in sidebar
2. Wait for page to load

### What to Check:
- [ ] Residents cards appear
- [ ] Search box works
- [ ] Gender filter works
- [ ] "Add Resident" button visible
- [ ] Can click on a resident card

### ✅ Success Indicators:
- See 3+ resident cards
- Each card shows: name, age, gender, bed number, admission date
- Search filters the list
- Gender dropdown filters correctly

---

## 5️⃣ Resident Profile Test

### Steps:
1. Click on "Vikram Singh" resident card
2. Check all tabs

### What to Check:
- [ ] **Overview Tab**: Shows basic info, health, skills, needs
- [ ] **Medical Tab**: Shows medical records list
- [ ] **Daily Logs Tab**: Shows log entries
- [ ] All tabs switch properly
- [ ] No errors when switching tabs

### ✅ Success Indicators:
- All 3 tabs are clickable
- Each tab shows different content
- Medical tab shows at least 2 records
- Daily logs tab shows entries

---

## 6️⃣ Medical Record Test

### Steps:
1. On resident profile, go to "Medical" tab
2. Click "Add Medical Record" button
3. Fill in:
   - Diagnosis: "Test Diagnosis"
   - Doctor: "Dr. Test"
   - Notes: "Test notes"
4. Click "Add Record"

### ✅ Success Indicators:
- Modal opens
- Form fields are editable
- "Add Record" button works
- Toast notification: "Medical record added"
- New record appears in list
- Modal closes

### ❌ If You See Problems:
- Modal doesn't open → Check console
- Form doesn't submit → Check for validation errors
- No toast → Check if MSW is running

---

## 7️⃣ Follow-Up Scheduling Test ⭐ CRITICAL

### Steps:
1. On resident profile, "Medical" tab
2. Find an existing medical record
3. Scroll down to "Schedule Follow-Up" section
4. Select tomorrow's date
5. Add notes: "Test follow-up"
6. Click "Schedule Follow-Up" button

### ✅ Success Indicators:
- Date picker works
- Notes field is editable
- Button shows "Scheduling..." briefly
- Toast notification: "Follow-up scheduled"
- Form clears after submission
- No console errors

### ❌ If You See Problems:
- Button doesn't work → Check console for errors
- No toast → MSW might not be running
- Error message → Check Network tab for 404

### Screenshot This:
📸 Take a screenshot of the successful toast notification!

---

## 8️⃣ Follow-Ups Page Test ⭐ CRITICAL

### Steps:
1. Click "Medical" in sidebar (or navigate to `/shelter/medical`)
2. Wait for page to load

### What to Check:
- [ ] Page shows 3 sections: Today / Upcoming / Overdue
- [ ] Stats cards at top show counts
- [ ] Your scheduled follow-up appears in correct section
- [ ] Each follow-up card shows:
  - Resident name
  - Date
  - Notes
  - "Complete" button (if not completed)

### ✅ Success Indicators:
- All 3 sections visible
- At least 2 follow-ups appear
- Follow-ups are in correct sections based on date
- Cards look good (no broken layout)

### Screenshot This:
📸 Take a screenshot of the follow-ups page!

---

## 9️⃣ Follow-Up Completion Test ⭐ CRITICAL

### Steps:
1. On `/shelter/medical` page
2. Find a follow-up in "Today" section
3. Click the "Complete" button

### ✅ Success Indicators:
- Button shows "Marking..." briefly
- Toast notification: "Follow-up marked as completed"
- Follow-up card turns green
- "Complete" button disappears
- Shows "Completed" with checkmark icon
- No console errors

### ❌ If You See Problems:
- Button doesn't work → Check console
- No visual change → Check Network tab
- Error message → MSW might not be intercepting

### Screenshot This:
📸 Take a screenshot of the completed follow-up (green card with checkmark)!

---

## 🔟 Shelter Requests Test

### Steps:
1. Click "Requests" in sidebar
2. View pending requests
3. Click "View Details" on a request
4. Click "Accept" button

### ✅ Success Indicators:
- Requests list loads
- Modal opens with details
- Accept button works
- Toast notification appears
- Request disappears from pending list

---

## 1️⃣1️⃣ Daily Logs Test

### Steps:
1. Go back to a resident profile
2. Click "Daily Logs" tab
3. Click "Add Log" button
4. Enter: "Test log entry"
5. Click "Add Log"

### ✅ Success Indicators:
- Form appears
- Text area is editable
- Submit button works
- Toast notification: "Log added"
- New log appears at top of list
- Shows timestamp and your name

---

## 1️⃣2️⃣ Walk-In Resident Test

### Steps:
1. Go to `/shelter/residents`
2. Click "Add Resident"
3. Select "Walk-In" option
4. Fill in:
   - Name: "Test Walk-In"
   - Age: 30
   - Gender: Male
5. Click "Add Resident"

### ✅ Success Indicators:
- Modal opens
- Walk-in form appears
- Form submits
- Toast notification
- New resident appears in list

---

## 🎯 Critical Features Summary

### Must Work for Evaluation:
1. ✅ Login
2. ✅ Dashboard loads
3. ✅ Residents list
4. ✅ Resident profile
5. ✅ **Schedule follow-up** ⭐
6. ✅ **View follow-ups page** ⭐
7. ✅ **Mark follow-up complete** ⭐
8. ✅ Medical records
9. ✅ Daily logs
10. ✅ Shelter requests

---

## 📊 Network Tab Verification

### What to Check:
1. Open DevTools (F12)
2. Go to "Network" tab
3. Perform any action (e.g., load follow-ups)
4. Look at the requests

### ✅ Success Indicators:
- All requests show **200** status (green)
- No **404** errors (red)
- Response shows JSON data (not HTML error pages)

### Example Good Request:
```
GET /api/shelter/medical/followups?shelterId=S001
Status: 200 OK
Response: [{id: "fu1", residentName: "Vikram Singh", ...}]
```

### Example Bad Request (MSW not working):
```
GET /api/shelter/medical/followups?shelterId=S001
Status: 404 Not Found
Response: <!DOCTYPE html>... (HTML error page)
```

---

## 🎬 Final Pre-Evaluation Test

### 5-Minute Complete Flow:
1. [ ] Clear cache
2. [ ] Open http://localhost:3001
3. [ ] Check console for MSW messages
4. [ ] Login
5. [ ] View dashboard
6. [ ] Go to residents
7. [ ] Click on Vikram Singh
8. [ ] Go to Medical tab
9. [ ] Schedule a follow-up
10. [ ] Go to /shelter/medical
11. [ ] Mark follow-up as complete
12. [ ] Take screenshots

### If All Steps Work:
🎉 **YOU'RE READY FOR EVALUATION!**

### If Any Step Fails:
1. Check console for errors
2. Check Network tab for 404s
3. Clear cache and try again
4. Restart dev server if needed
5. Use incognito mode as backup

---

## 📸 Screenshots to Take

For your evaluation, take these screenshots:

1. **Dashboard** - showing all 4 cards with data
2. **Residents List** - showing multiple resident cards
3. **Resident Profile** - showing all tabs
4. **Medical Records** - showing list of records
5. **Follow-Up Scheduled** - toast notification
6. **Follow-Ups Page** - showing categorized follow-ups
7. **Follow-Up Completed** - green card with checkmark
8. **Console** - showing MSW messages
9. **Network Tab** - showing 200 responses

---

## ✅ Success Criteria

Your app is ready when:
- [ ] No 404 errors in Network tab
- [ ] No red errors in Console
- [ ] MSW messages appear in Console
- [ ] All pages load without infinite spinners
- [ ] All buttons work and show feedback
- [ ] Toast notifications appear for actions
- [ ] Follow-up scheduling works
- [ ] Follow-up completion works
- [ ] Data persists during session

---

## 🆘 Emergency Troubleshooting

### Problem: Nothing Works
**Solution**: 
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
# Clear browser cache
# Hard refresh
```

### Problem: MSW Not Starting
**Solution**:
```bash
cd homeless-aid-platform/frontend
npx msw init public/ --save
# Restart server
# Clear browser cache
```

### Problem: Data Disappeared
**Solution**:
This is normal! Mock data resets when you clear browser data.
Just use the app normally and data will repopulate.

---

**Last Updated**: November 28, 2025
**Status**: ✅ READY FOR TESTING
