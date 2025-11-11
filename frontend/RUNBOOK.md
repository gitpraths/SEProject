# 🔧 NEST - Operations Runbook

> Deployment, configuration, testing, and troubleshooting guide for NEST platform

---

## 📦 Deployment Setup

### Local Development

1. **Environment Setup**
   ```bash
   cd homeless-aid-platform/frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

2. **Access Application**
   - URL: `http://localhost:3000`
   - Default Port: 3000
   - Hot Reload: Enabled

### Production Build

```bash
npm run build
npm start
```

### Replit Deployment

1. **Import Project**
   - Upload project to Replit
   - Select "Next.js" as template

2. **Configure Run Command**
   ```bash
   npm install --legacy-peer-deps && npm run dev
   ```

3. **Environment**
   - Node Version: 18+
   - Port: Auto-assigned by Replit

---

## 🔐 Environment Variables

### Create `.env.local` (Optional)

```env
# Application
NEXT_PUBLIC_APP_NAME=NEST
NEXT_PUBLIC_APP_VERSION=1.0.0

# API (for future backend integration)
# NEXT_PUBLIC_API_URL=http://localhost:4000

# Maps
# NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here

# Analytics (for future)
# NEXT_PUBLIC_GA_ID=your_ga_id
```

### Example File: `.env.local.example`

```env
# Copy this file to .env.local and fill in values
NEXT_PUBLIC_APP_NAME=NEST
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Note**: Currently, the app works without environment variables as it uses MSW for mocking.

---

## 🗄️ Data Management

### Reset Mock Data

**Method 1: Via Settings Page**
1. Navigate to `/settings`
2. Scroll to "Offline Data" section
3. Click "Clear Offline Data"
4. Confirm deletion

**Method 2: Browser Console**
```javascript
// Clear all localStorage
localStorage.clear();

// Clear specific keys
localStorage.removeItem('session');
localStorage.removeItem('mock_profiles');
localStorage.removeItem('mock_shelters');
localStorage.removeItem('mock_jobs');
localStorage.removeItem('mock_matches');

// Clear IndexedDB (offline queue)
indexedDB.deleteDatabase('homelessaid');

// Reload page
location.reload();
```

**Method 3: Browser DevTools**
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data

### Default Mock Data

**Profiles**: 3 sample profiles (Ravi Kumar, Lata Devi, Suresh Babu)  
**Shelters**: 5 shelters with varying capacity  
**Jobs**: 6 job listings (part-time and full-time)  
**Matches**: 3 AI-generated matches with recommendations

---

## 👤 Roles & Login Instructions

### Test Accounts

**Any email/password combination works** (mock authentication)

Example credentials:
```
Email: volunteer@nest.org
Password: password123
Role: Select "Volunteer"

Email: ngo@nest.org
Password: password123
Role: Select "NGO"

Email: admin@nest.org
Password: password123
Role: Select "Admin"
```

### Role Permissions

| Feature | Volunteer | NGO | Admin |
|---------|-----------|-----|-------|
| View Profiles | ✅ | ✅ | ✅ |
| Create Profiles | ✅ | ✅ | ✅ |
| Edit Profiles | ❌ | ✅ | ✅ |
| Delete Profiles | ❌ | ❌ | ✅ |
| View Resources | ✅ | ✅ | ✅ |
| Add Resources | ❌ | ✅ | ✅ |
| Edit Resources | ❌ | ✅ | ✅ |
| Delete Resources | ❌ | ❌ | ✅ |
| View Matches | ❌ | ✅ | ✅ |
| Assign Matches | ❌ | ✅ | ✅ |
| View Reports | ❌ | ✅ | ✅ |
| Export Data | ❌ | ✅ | ✅ |

---

## 🧪 Testing Guide

### Test Offline Mode

1. **Enable Offline Mode**
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Offline" checkbox
   - Or use Application tab → Service Workers → Offline

2. **Test Offline Operations**
   - Create a new profile
   - Add a shelter or job
   - Observe offline banner at top
   - Check navbar for sync indicator (🔁 with badge)

3. **Test Sync**
   - Go back online (uncheck Offline)
   - Click sync indicator in navbar OR
   - Go to Settings → Click "Sync Now"
   - Verify toast notification shows sync success
   - Check that pending count decreases to 0

### Test Language Toggle

1. **Switch Language**
   - Click globe icon (🌐) in navbar
   - Or go to Settings → Language & Localization
   - Select "हिंदी (Hindi)"

2. **Verify Translation**
   - Check navbar labels change to Hindi
   - Check sidebar menu items
   - Check button text on pages
   - Verify language persists after refresh

3. **Switch Back**
   - Click globe icon again
   - Select "English"
   - Verify UI returns to English

### Test Report Export

**CSV Export**
1. Navigate to `/reports`
2. Select date range (7/30/90 days)
3. Click "Export CSV"
4. Verify file downloads: `nest-report-{days}days-{date}.csv`
5. Open in spreadsheet app
6. Verify columns: date, profiles, assignments

**PDF Export**
1. Navigate to `/reports`
2. Click "Download PDF"
3. Wait for "Generating PDF..." toast
4. Verify file downloads: `nest-report-{days}days-{date}.pdf`
5. Open PDF
6. Verify: Title, date, summary stats, charts (if captured)

### Test Profile Creation

1. **Start Wizard**
   - Navigate to `/profiles/create`
   - Verify 6-step progress indicator

2. **Complete Steps**
   - Step 1: Basic Info (name, age, gender)
   - Step 2: Location (click map or enter address)
   - Step 3: Health (conditions, disabilities)
   - Step 4: Skills & Work History
   - Step 5: Needs & Priority
   - Step 6: Review & Submit

3. **Verify Auto-save**
   - Fill step 1, navigate away
   - Return to `/profiles/create`
   - Verify data is restored from draft

4. **Submit**
   - Complete all steps
   - Click "Submit Profile"
   - Verify redirect to profile view
   - Check QR code generation

### Test Resource Management

**Add Shelter**
1. Navigate to `/resources/shelters`
2. Click "Add Shelter" (NGO/Admin only)
3. Fill form:
   - Name, Address, Phone
   - Capacity: 50, Occupied: 30
4. Submit
5. Verify appears in list
6. Verify capacity bar shows 60% (30/50)

**Validation Test**
1. Try to set Occupied > Capacity
2. Verify error message appears
3. Verify form doesn't submit

**Edit/Delete**
1. Click edit icon on shelter card
2. Modify details
3. Save and verify changes
4. Click delete icon
5. Confirm deletion
6. Verify removed from list

---

## 🐛 Troubleshooting

### Issue: Map Not Loading

**Symptoms**: Blank map area, no tiles visible

**Solutions**:
1. Check internet connection (maps require online access)
2. Verify OpenStreetMap is not blocked by firewall
3. Check browser console for CORS errors
4. Clear browser cache and reload
5. Try different browser

**Workaround**: Enter address manually instead of using map

---

### Issue: MSW Not Initializing

**Symptoms**: 
- API calls return 404
- Console shows "MSW not initialized"
- No mock data loading

**Solutions**:
1. **Regenerate Service Worker**
   ```bash
   npx msw init public/ --save
   ```

2. **Clear Service Worker Cache**
   - DevTools → Application → Service Workers
   - Click "Unregister" on existing worker
   - Reload page

3. **Check MSW Version**
   ```bash
   npm list msw
   ```
   Should be 2.x.x

4. **Verify Worker File**
   - Check `public/mockServiceWorker.js` exists
   - File should be ~60KB

5. **Hard Refresh**
   - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

### Issue: i18next Errors

**Symptoms**: 
- Console error: "NO_I18NEXT_INSTANCE"
- Translations not working
- Language toggle has no effect

**Solutions**:
1. **Clear Browser Cache**
   - Hard refresh (Cmd+Shift+R)
   - Clear localStorage

2. **Check Package Installation**
   ```bash
   npm list i18next react-i18next
   ```

3. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Verify Language Files**
   - Check `components/ClientI18nProvider.tsx`
   - Verify resources object has `en` and `hi` keys

---

### Issue: Offline Sync Not Working

**Symptoms**:
- Pending items don't sync
- Sync button does nothing
- No toast notifications

**Solutions**:
1. **Check Online Status**
   - Verify actually online (check other websites)
   - Disable "Offline" mode in DevTools

2. **Check Pending Queue**
   ```javascript
   // In browser console
   import('localforage').then(lf => {
     const queue = lf.createInstance({ name: 'homelessaid', storeName: 'pendingQueue' });
     queue.iterate((value, key) => console.log(key, value));
   });
   ```

3. **Manual Sync**
   - Go to Settings
   - Click "Sync Now"
   - Check console for errors

4. **Clear Queue**
   - Settings → Clear Offline Data
   - Recreate operations while online

---

### Issue: Dark Mode Not Persisting

**Symptoms**: Theme resets to light on refresh

**Solutions**:
1. **Check localStorage**
   ```javascript
   localStorage.getItem('darkMode'); // Should be 'true' or 'false'
   ```

2. **Set Manually**
   ```javascript
   localStorage.setItem('darkMode', 'true');
   location.reload();
   ```

3. **Use Settings Page**
   - Navigate to `/settings`
   - Toggle theme
   - Verify persists after refresh

---

### Issue: Charts Not Rendering

**Symptoms**: Empty chart areas in Reports page

**Solutions**:
1. **Check Data**
   - Verify analytics API returns data
   - Check browser console for errors

2. **Verify Recharts Installation**
   ```bash
   npm list recharts
   ```

3. **Check Date Range**
   - Try different date ranges (7/30/90 days)
   - Verify data exists for selected range

4. **Reload Page**
   - Hard refresh
   - Clear React Query cache

---

### Issue: PDF Export Fails

**Symptoms**: 
- "Failed to generate PDF" toast
- PDF downloads but is blank/corrupted

**Solutions**:
1. **Check jsPDF Installation**
   ```bash
   npm list jspdf html2canvas
   ```

2. **Disable Chart Capture**
   - PDF will generate with totals only
   - Charts may fail to capture in some browsers

3. **Try Different Browser**
   - Chrome/Edge work best for PDF generation
   - Firefox may have canvas issues

4. **Check Console**
   - Look for canvas/CORS errors
   - May need to adjust chart rendering

---

### Issue: Navigation Not Working

**Symptoms**: Clicking links doesn't navigate

**Solutions**:
1. **Hard Refresh**
   - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

2. **Check Fast Refresh**
   - Hot reload may interfere in dev mode
   - Use anchor tags (`<a>`) instead of `<Link>` for critical navigation

3. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check Browser Console**
   - Look for JavaScript errors
   - Verify no infinite loops

---

## 📊 Performance Optimization

### Production Checklist

- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No console errors in production build
- [ ] Images optimized
- [ ] Unused dependencies removed
- [ ] Environment variables configured
- [ ] Service worker registered
- [ ] Analytics configured (if applicable)

### Monitoring

**Key Metrics to Track**:
- Page load time: < 3s
- Time to Interactive: < 5s
- Lighthouse Score: > 90
- Bundle size: < 500KB (gzipped)

---

## 🔄 Update & Maintenance

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest --legacy-peer-deps
```

### MSW Worker Update

```bash
# When MSW version changes
npx msw init public/ --save
```

### Clear Build Cache

```bash
rm -rf .next
rm -rf node_modules
npm install --legacy-peer-deps
npm run dev
```

---

## 📞 Support Contacts

**Technical Issues**: Check browser console first  
**Data Issues**: Use Settings → Clear Offline Data  
**Feature Requests**: Document in project repository  
**Bug Reports**: Include browser, OS, and steps to reproduce

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Maintained by**: Amrita School of Computing
