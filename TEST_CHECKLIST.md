# 🧪 CyberEdu - Complete Test Checklist

## ✅ Pre-Test Setup

### 1. Backend Running
```bash
cd cyberedu-backend
npm run start:dev
```
**Expected**: Console shows "🚀 CyberEdu Backend Started"

### 2. MongoDB Running
**Expected**: Backend connects without errors

### 3. Test User Available
- Email: `student@test.com`
- Password: `Student123`

---

## 🎯 Test Scenarios (In Order)

### ✅ Test 1: Landing Page
1. Open `index.html` in browser
2. **Expected**:
   - Landing page shows
   - "Login" and "Sign Up Free" buttons visible
   - Navbar is hidden
   - No console errors

### ✅ Test 2: Registration Flow
1. Click "Sign Up Free"
2. Fill form:
   - Full Name: `Test Student`
   - Email: `newstudent@test.com`
   - Password: `Test1234`
   - Role: `Student`
3. Click "Create Account"
4. **Expected**:
   - Green flash message: "Account created!"
   - Redirected to login page
   - No errors in console

### ✅ Test 3: Login Flow
1. On login page, enter:
   - Email: `student@test.com`
   - Password: `Student123`
2. Click "Sign In"
3. **Expected**:
   - Green flash message: "Login successful!"
   - Redirected to dashboard
   - Navbar appears at top
   - Dashboard shows "Welcome back, John!"
   - User initials "J" in top-right avatar

### ✅ Test 4: Dashboard
1. After login, check dashboard
2. **Expected**:
   - User name displayed correctly
   - Stats cards show (even if 0)
   - "Continue Learning" section visible
   - Recent labs section (may show "No labs available")
   - Navbar visible with all menu items

### ✅ Test 5: Navigation
1. Click each navbar link:
   - Dashboard
   - Labs
   - Reports
   - Leaderboard
   - Profile
2. **Expected**:
   - Each page loads without errors
   - Navbar stays visible
   - Page content appears
   - No console errors

### ✅ Test 6: Labs Page
1. Click "Labs" in navbar
2. **Expected**:
   - Labs page loads
   - Search box visible
   - Filter dropdown works
   - Category tabs visible
   - Either labs list OR "No labs available" message
   - No errors

### ✅ Test 7: Profile Page
1. Click "Profile" in navbar
2. **Expected**:
   - Profile page loads
   - User name displayed in header
   - Email displayed
   - Role badge shows "Student"
   - Form fields populated with user data
   - Avatar shows first letter of name

### ✅ Test 8: Profile Edit
1. On profile page, click "Edit" button
2. Change first name
3. Click "Save Changes"
4. **Expected**:
   - Flash message: "Profile updated!"
   - Fields become read-only again
   - Changes saved to localStorage

### ✅ Test 9: Logout
1. Click user avatar (top-right)
2. Click logout (or add logout button)
3. **Expected**:
   - Redirected to landing page
   - Navbar hidden
   - localStorage cleared
   - Can't access dashboard without login

### ✅ Test 10: Session Persistence
1. Login successfully
2. Refresh page (F5)
3. **Expected**:
   - Still logged in
   - Dashboard loads automatically
   - User data still displayed

---

## 🔍 What to Check in Browser Console (F12)

### ✅ No Errors Should Appear For:
- ✅ Module imports
- ✅ Function calls
- ✅ API requests
- ✅ Page navigation

### ⚠️ Expected Warnings (OK to ignore):
- 404 for icons/images (doesn't break functionality)
- "Labs not loaded yet" (if no labs in database)

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module"
**Fix**: Make sure all JS files are in `assets/js/` folder

### Issue: Login doesn't work
**Fix**: 
1. Check backend is running
2. Check console for API errors
3. Verify baseURL is `http://localhost:3000/api/v1`

### Issue: Page doesn't change
**Fix**: Check console for `showPage` errors

### Issue: Flash messages don't show
**Fix**: Check `flash-message-container` exists in HTML

### Issue: User name shows "User" instead of real name
**Fix**: Check localStorage has user data: `localStorage.getItem('user')`

---

## 🎯 Success Criteria

### ✅ PASS if:
1. Can register new user
2. Can login with credentials
3. Dashboard loads with user name
4. Can navigate between all pages
5. Navbar shows/hides correctly
6. Profile loads user data
7. Can edit and save profile
8. Can logout and login again
9. Session persists on refresh
10. No critical console errors

### ❌ FAIL if:
- Login doesn't redirect to dashboard
- Console shows module errors
- Pages don't load
- Navbar doesn't appear after login
- User data doesn't display

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

[ ] Test 1: Landing Page
[ ] Test 2: Registration
[ ] Test 3: Login
[ ] Test 4: Dashboard
[ ] Test 5: Navigation
[ ] Test 6: Labs Page
[ ] Test 7: Profile Page
[ ] Test 8: Profile Edit
[ ] Test 9: Logout
[ ] Test 10: Session Persistence

Overall Status: PASS / FAIL
Notes: ___________
```

---

## 🚀 Quick Test (30 seconds)

1. Open `test-login.html`
2. Click "Test Login"
3. If ✅ success → Backend works
4. Open `index.html`
5. Login with `student@test.com` / `Student123`
6. If dashboard loads → Frontend works
7. Click through navbar links
8. If all pages load → **EVERYTHING WORKS!** 🎉

---

## 📞 If Tests Fail

1. Check `QUICK_START.md` for setup instructions
2. Verify backend is running on port 3000
3. Check browser console (F12) for specific errors
4. Clear browser cache and localStorage
5. Try in incognito/private window

---

**Good luck with testing, Raihaan! You got this! 🚀**
