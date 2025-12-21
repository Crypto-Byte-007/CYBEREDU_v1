# CYBEREDU FRONTEND-BACKEND INTEGRATION CHECKLIST

## AUTHENTICATION MODULE
- [x] Login form connects to /auth/login
- [x] Registration form connects to /auth/register
- [x] Auto token refresh implemented
- [x] Logout clears tokens
- [x] Protected routes check authentication
- [x] User profile fetched from /auth/me

## LABS MODULE
- [x] Lab list fetched from /labs
- [x] Lab details fetched from /labs/:id
- [x] Lab start posts to /labs/:id/start
- [x] Progress saved to /labs/:id/progress
- [ ] Step completion posts to /labs/:id/steps/:step/complete
- [ ] Hints fetched from /labs/:id/hints/:step

## REPORTS MODULE
- [x] User reports fetched from /reports/my
- [x] Lab report generation via /reports/lab/:id/generate
- [ ] Progress report generation via /reports/user/:id/generate-progress
- [x] Report export functionality

## NOTIFICATIONS MODULE
- [x] Notifications fetched from /notifications
- [ ] Unread count from /notifications/unread-count
- [x] Mark as read via PATCH /notifications/:id/read
- [x] Mark all read via PATCH /notifications/read-all

## FILE UPLOADS MODULE
- [ ] File upload to /uploads/labs/:id/evidence
- [ ] User files listed from /uploads/my
- [ ] File download from /uploads/files/:id
- [ ] File deletion via DELETE /uploads/files/:id
- [ ] Storage quota checked

## UI COMPONENTS
- [x] Dashboard shows real user data
- [x] Lab progress bars reflect backend progress
- [x] Notifications dropdown shows real notifications
- [x] Profile page updates backend data
- [x] All forms handle API errors gracefully

## SECURITY
- [x] Tokens properly stored and refreshed
- [x] API calls include Authorization header
- [x] 401 errors handled with auto-logout
- [x] Input validation on all forms
- [ ] File uploads validated

## PERFORMANCE
- [ ] API responses cached where appropriate
- [ ] Images optimized
- [ ] Lazy loading for lab content
- [ ] Debounced search/filter inputs

## TESTING
- [ ] Login/logout flow works
- [ ] Lab start and progress saves
- [ ] File upload and download works
- [ ] All error states handled
- [ ] Mobile responsive