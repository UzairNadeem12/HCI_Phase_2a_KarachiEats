# 🚀 Quick Start - Backend Integration

## ✅ What Was Updated

### Service Layer
- **`src/services/appsScript.ts`** - Updated with proper error handling, timestamp formatting, and type definitions

### Authentication Pages
- **`src/pages/Auth.tsx`** - Signup now calls backend, routes to OTP verification on success

### Order Management
- **`src/pages/Checkout.tsx`** - Order placement integrated, returns real order ID from backend
- **`src/pages/OrderHistory.tsx`** - Fetches orders from backend on mount
- **`src/pages/OrderTracking.tsx`** - No changes (ready for real tracking enhancement)

### User Profile
- **`src/pages/Profile.tsx`** - Fetches user data on mount, shows saved locations
- **`src/components/LocationPicker.tsx`** - Saves new locations to backend

---

## 📝 Configuration Required

**Before testing, update the Apps Script URL:**

```typescript
// File: src/services/appsScript.ts
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE';
```

Replace with your actual Google Apps Script web app URL.

---

## 🔄 API Endpoints (All POST)

All requests go to a single endpoint with action routing:

```
POST {APPS_SCRIPT_URL}
```

### Request Formats:

**Signup:**
```json
{
  "action": "signup",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0300-1234567",
    "location": "Karachi, Pakistan"
  }
}
```

**Verify OTP:**
```json
{
  "action": "verifyOTP",
  "email": "user@example.com",
  "otp": "123456"
}
```

**Get User:**
```json
{
  "action": "getUser",
  "email": "user@example.com"
}
```

**Add Location:**
```json
{
  "action": "addLocation",
  "email": "user@example.com",
  "location": "New address"
}
```

**Save Order:**
```json
{
  "action": "saveOrder",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0300-1234567",
    "location": "Karachi, Pakistan",
    "items": [
      {"id": "m1", "name": "Biryani", "quantity": 2, "price": 350}
    ],
    "total": 800,
    "paymentMethod": "cash",
    "scheduledTime": "",
    "timestamp": "2025-01-20T10:30:45.123Z"
  }
}
```

**Get Orders:**
```json
{
  "action": "getOrders",
  "email": "user@example.com"
}
```

---

## ✨ Key Features Implemented

### 1. **Sign Up Flow**
- ✅ Collects: name, email, phone, location
- ✅ Validates: email format, password strength, password match
- ✅ Sends OTP to email
- ✅ Routes to OTP verification page

### 2. **OTP Verification**
- ✅ Verifies 6-digit OTP
- ✅ Fetches user profile after verification
- ✅ Sets authentication context
- ✅ Redirects to profile page

### 3. **Order Placement**
- ✅ Collects contact details and email
- ✅ Supports scheduled delivery
- ✅ Multiple payment methods (cash, card, mobile wallet)
- ✅ Returns real order ID
- ✅ Redirects to order tracking

### 4. **Order History**
- ✅ Fetches all user orders
- ✅ Shows order details with formatted timestamps
- ✅ Displays payment method and status
- ✅ Reorder and view details buttons

### 5. **User Profile**
- ✅ Loads user data from backend
- ✅ Shows saved locations
- ✅ Edit profile (name, phone)
- ✅ Change delivery location
- ✅ Link to order history

### 6. **Location Management**
- ✅ Save custom locations
- ✅ Popular locations quick-select
- ✅ For logged-in users: saved to backend
- ✅ For guests: local storage only

---

## 🎯 User Flows

### New User Registration
1. Click "Sign Up" tab
2. Enter name, email, phone, location
3. Set password (min 6 chars)
4. System sends OTP to email
5. Enter OTP on verification page
6. Profile page loads with user data
7. User can now place orders

### Guest Ordering
1. Click "Continue as Guest"
2. Browse restaurants
3. Add items to cart
4. Go to checkout
5. Enter name, phone, email for this order
6. Choose payment method
7. Place order
8. Get order tracking page

### Logged-in User Ordering
1. Log in via signup/OTP flow
2. Browse restaurants
3. Add items to cart
4. Checkout pre-fills with user data
5. Can add new locations
6. Place order
7. Order synced to profile

---

## 🔍 Testing Quick Checklist

- [ ] Signup → receive OTP → verify → redirected to profile
- [ ] Profile shows user data from backend
- [ ] Change location → location saved to backend
- [ ] Place order → get real order ID → can view on history
- [ ] View order history → shows all previous orders
- [ ] Order shows correct timestamp in Pakistan time
- [ ] Error messages display for invalid inputs
- [ ] Toast notifications for success/error

---

## 🛠️ Debugging Tips

### Check Network Requests
- Open DevTools → Network tab
- Filter by XHR/Fetch
- Look for POST requests
- Check request/response bodies

### Common Issues

**"Failed to connect to server"**
- Verify APPS_SCRIPT_URL is set correctly
- Check URL doesn't have trailing slash
- Verify Apps Script is deployed as Web App

**"Invalid OTP"**
- Check OTP expiry (10 minutes)
- Verify correct email in request

**Order not showing in history**
- Ensure user is logged in (userInfo?.email exists)
- Check email matches between orders and user
- Verify timestamp is ISO format

**Location not saving**
- For guests: check browser localStorage
- For logged-in users: verify email is set
- Check backend response for errors

---

## 📊 Data Flow Diagram

```
Sign Up Form
    ↓
sendSignup() → Backend
    ↓
OTP sent via email
    ↓
User enters OTP
    ↓
verifyOTP() → Backend
    ↓
getUserData() → Backend
    ↓
Context updated (userInfo, isLoggedIn)
    ↓
Redirect to Profile
    ↓
User can now place orders
```

---

## 🚀 Next Steps

1. **Deploy Apps Script:**
   - Go to Google Sheets
   - Extensions → Apps Script
   - Deploy as Web App
   - Copy URL

2. **Update Frontend URL:**
   - Edit `src/services/appsScript.ts`
   - Replace `APPS_SCRIPT_URL`

3. **Test Each Flow:**
   - Auth (signup → OTP)
   - Checkout (new order)
   - Profile (view data)
   - Order History (view past orders)

4. **Monitor Errors:**
   - Check browser console
   - Check toast notifications
   - Check Apps Script logs

---

## 📞 Support

### Common Response Codes

| Status | Meaning |
|--------|---------|
| `success: true` | Request succeeded |
| `success: false` | Request failed, check `error` field |
| Network error | Check connection and URL |

### Error Messages

| Error | Cause |
|-------|-------|
| "User already exists" | Email already registered |
| "Invalid OTP" | Wrong OTP or expired |
| "User not found" | Email not in system |
| "Failed to send OTP email" | Gmail not configured |
| "Server error" | Apps Script error |

---

**All integrations are complete and ready for testing!** ✅
