# API Integration Audit - Karachi Eats Frontend

## Summary
This document identifies all locations in the frontend where API calls are made, along with OTP requests, authentication, and order-related flows that will need to be updated when switching to the new backend.

---

## 1. CURRENT BACKEND SERVICE (appsScript.ts)

### Location: `src/services/appsScript.ts`

**Base URL:**
- Currently uses: `APPS_SCRIPT_URL` (placeholder variable)
- Default behavior: Single fetch URL with action routing

**Exported Functions & Their Current Implementations:**

```typescript
✓ sendSignup(data: SignupData)
✓ verifyOTP(email: string, otp: string)
✓ getUserData(email: string)
✓ saveOrder(orderData: OrderData)
✓ getOrderHistory(email: string)
✓ addLocation(email: string, location: string)
```

**Current API Pattern:**
- All requests: `POST` to single endpoint
- Routing: Via `action` field in JSON body
- Response format: `{ success: boolean, data?: any, error?: string }`

---

## 2. AUTHENTICATION FLOWS

### 2.1 SIGNUP & OTP REQUEST

**File:** `src/pages/Auth.tsx` (Lines: Sign Up Tab)

**Current Implementation:**
```typescript
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  if (signupData.password !== signupData.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }
  setIsLoading(true);
  // Currently: SIMULATED (setTimeout 1500ms)
  setTimeout(() => {
    setIsLoading(false);
    toast.success('Account created successfully!');
    navigate('/home');
  }, 1500);
};
```

**Status:** ⚠️ NOT INTEGRATED - Currently simulated
- Takes: `name`, `email`, `password`, `confirmPassword`
- Currently doesn't call backend

**What Needs to Change:**
- Remove simulated setTimeout
- Call new backend signup endpoint
- Should trigger OTP sending
- Navigate to `/verify-otp` with email in state (instead of `/home`)

**Connected Service:** `sendSignup()` from appsScript.ts (but not called)

---

### 2.2 OTP VERIFICATION

**File:** `src/pages/VerifyOTP.tsx` (Full flow)

**Current Implementation:**
```typescript
const handleVerify = async () => {
  if (!otp || otp.length !== 6) {
    toast.error('Please enter a valid 6-digit OTP');
    return;
  }

  setLoading(true);
  try {
    const result = await verifyOTP(email, otp);  // ✓ CALLS SERVICE
    
    if (result.success) {
      // Fetch user data after successful OTP verification
      const userData = await getUserData(email);  // ✓ CALLS SERVICE
      
      if (userData.success && userData.data) {
        setUserInfo({
          email: userData.data.email,
          name: userData.data.name,
          phone: userData.data.phone,
          locations: userData.data.locations,
        });
        setIsLoggedIn(true);
        toast.success('Account verified successfully!');
        navigate('/profile');
      } else {
        toast.error(userData.error || 'Failed to fetch user data');
      }
    } else {
      toast.error(result.error || 'Invalid OTP');
    }
  } catch (error) {
    toast.error('Failed to verify OTP');
  } finally {
    setLoading(false);
  }
};
```

**Status:** ✓ INTEGRATED (2 backend calls)

**Service Calls:**
1. `verifyOTP(email, otp)` - Line 29
2. `getUserData(email)` - Line 33

**Data Flow:**
- Takes email (from location state)
- Takes OTP (user input, must be 6 digits)
- Calls verify endpoint
- On success: Calls getUserData
- Sets user context (email, name, phone, locations)
- Sets isLoggedIn = true

**Connected Services:**
- `verifyOTP(email, otp)` from appsScript.ts
- `getUserData(email)` from appsScript.ts

---

### 2.3 LOGIN FLOW

**File:** `src/pages/Auth.tsx` (Lines: Login Tab)

**Current Implementation:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  // Currently: SIMULATED (setTimeout 1500ms)
  setTimeout(() => {
    setIsLoading(false);
    toast.success('Login successful!');
    navigate('/home');
  }, 1500);
};
```

**Status:** ⚠️ NOT INTEGRATED - Currently simulated
- Takes: `email`, `password`
- Currently doesn't call backend

**What Needs to Change:**
- Remove simulated setTimeout
- Call new backend login endpoint
- Authenticate user
- Store authentication token/session
- Redirect to home or profile

---

## 3. ORDER FLOWS

### 3.1 PLACE ORDER (ORDER CREATION)

**File:** `src/pages/Checkout.tsx`

**Current Implementation:**
```typescript
const handlePlaceOrder = () => {
  if (!guestName || !guestPhone) {
    toast.error('Please fill in your contact details');
    return;
  }
  if (isScheduled && !scheduledTime) {
    toast.error('Please select a delivery time');
    return;
  }
  if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV)) {
    toast.error('Please fill in your card details');
    return;
  }
  if (paymentMethod === 'jazzcash' && !mobileWallet) {
    toast.error('Please enter your JazzCash/Easypaisa number');
    return;
  }
  
  clearCart();
  
  if (isScheduled) {
    toast.success(`Order scheduled for ${scheduledTime}! We'll deliver at the requested time.`);
  } else {
    toast.success('Order placed successfully! Your food is on the way.');
  }
  
  navigate('/tracking/12345');  // ← HARDCODED ORDER ID
};
```

**Status:** ⚠️ NOT INTEGRATED - Currently simulated

**Collected Data:**
- Contact Details: `guestName`, `guestPhone`
- Payment Method: `paymentMethod` (cash/card/jazzcash)
- Card Details (if card): `cardNumber`, `cardExpiry`, `cardCVV`
- Mobile Wallet (if jazzcash): `mobileWallet`
- Scheduling: `isScheduled`, `scheduledTime` (optional)
- Cart Items: From context (cart array with id, name, quantity, price)
- Cart Total: From context (`cartTotal`)
- Delivery Fee: Calculated (from cart[0].deliveryFee)

**What Needs to Change:**
- Remove simulated navigation to hardcoded `/tracking/12345`
- Call new backend `saveOrder` endpoint
- Pass user email (from context)
- Get back real orderId
- Navigate to `/tracking/{orderId}` with real ID
- Clear cart on success

**Connected Service:** `saveOrder(orderData)` from appsScript.ts (but not called)

---

### 3.2 FETCH ORDER HISTORY

**File:** `src/pages/OrderHistory.tsx`

**Current Implementation:**
```typescript
const dummyOrders = [
  {
    id: '12345',
    date: '2025-01-15',
    restaurant: 'Biryani House',
    items: ['Chicken Biryani', 'Raita'],
    total: 430,
    status: 'delivered',
  },
  // ... more dummy data
];

// Component directly uses dummyOrders array
{dummyOrders.map((order) => (
  <Card key={order.id} className="p-4 sm:p-6">
    // Display order details
  </Card>
))}
```

**Status:** ⚠️ NOT INTEGRATED - Uses hardcoded dummy data

**What Needs to Change:**
- Remove dummyOrders array
- Call new backend `getOrderHistory` endpoint on component mount
- Fetch using user email (from context)
- Store returned orders in state
- Display from state instead of hardcoded array

**Connected Service:** `getOrderHistory(email)` from appsScript.ts (but not called)

---

### 3.3 ORDER TRACKING

**File:** `src/pages/OrderTracking.tsx`

**Current Implementation:**
```typescript
const [currentStep, setCurrentStep] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentStep(prev => {
      if (prev < allSteps.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, 10000); // Change status every 10 seconds
  
  return () => clearInterval(interval);
}, []);
```

**Status:** ⚠️ NOT INTEGRATED - Uses simulated progression

**Current Data:**
- OrderId from URL params: `useParams().orderId`
- Statuses simulated: Order Confirmed → Preparing Food → Out for Delivery → Delivered
- Updates every 10 seconds

**What Needs to Change:**
- Poll new backend for order status updates
- Fetch using orderId from URL params
- Update status based on backend response instead of timer
- Show real rider information (currently: hardcoded "Ahmed Khan, 4.8/5")
- Real-time tracking data instead of simulated progression

---

## 4. PROFILE & LOCATION MANAGEMENT

### 4.1 FETCH/UPDATE USER PROFILE

**File:** `src/pages/Profile.tsx`

**Current Implementation:**
```typescript
const [guestData, setGuestData] = useState({
  name: 'Guest User',
  email: 'guest@karachieats.com',
  phone: '0300-1234567',
});

const handleSave = () => {
  setIsEditing(false);
  toast.success('Profile updated successfully!');
};
```

**Status:** ⚠️ NOT INTEGRATED - Uses hardcoded guest data

**What Needs to Change:**
- On mount: Fetch user profile data (if logged in) using email from context
- Show real user data (name, email, phone)
- Call backend to update profile on save
- Handle both logged-in and guest scenarios

**Connected Services:**
- `getUserData(email)` - for fetching
- Potential: New update profile endpoint

---

### 4.2 ADD LOCATION TO PROFILE

**File:** `src/pages/Profile.tsx` + `src/components/LocationPicker.tsx`

**Current Implementation:**
- `LocationPicker` component allows selecting/adding locations
- Currently no backend integration

**Status:** ⚠️ NOT INTEGRATED

**What Needs to Change:**
- Call new backend `addLocation` endpoint when location is added
- Update user locations in context and backend

**Connected Service:** `addLocation(email, location)` from appsScript.ts (but not called)

---

## 5. CONTEXT & STATE MANAGEMENT

**File:** `src/contexts/AppContext.tsx`

**Current State:**
```typescript
export interface UserInfo {
  email: string;
  name: string;
  phone: string;
  locations: string[];
}

// State variables
const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
const [isLoggedIn, setIsLoggedIn] = useState(false);
```

**Current Usage:**
- `userInfo` - Populated after OTP verification in VerifyOTP.tsx
- `isLoggedIn` - Set to true after successful authentication

**Status:** ✓ BASIC INTEGRATION - Used correctly in VerifyOTP

**Note:** Profile page doesn't fetch user data on load if already logged in

---

## 6. SUMMARY OF CHANGES NEEDED

### ✓ ALREADY INTEGRATED (1 flow)
- [x] OTP Verification Flow (`VerifyOTP.tsx`)
  - Calls `verifyOTP(email, otp)`
  - Calls `getUserData(email)`
  - Properly sets context

### ⚠️ NOT INTEGRATED (6 flows/endpoints)

| Flow | File | Status | Service Called | Action Needed |
|------|------|--------|-----------------|---------------|
| Sign Up | Auth.tsx | Simulated | sendSignup() | Integrate - currently setTimeout |
| Login | Auth.tsx | Simulated | N/A | Create new endpoint call |
| Place Order | Checkout.tsx | Simulated | saveOrder() | Integrate - hardcoded orderId |
| Fetch Orders | OrderHistory.tsx | Dummy Data | getOrderHistory() | Integrate - fetch on mount |
| Order Tracking | OrderTracking.tsx | Simulated | N/A | Create real polling |
| Update Profile | Profile.tsx | Simulated | N/A | Integrate - fetch on mount |
| Add Location | LocationPicker | Not implemented | addLocation() | Integrate - add location |
| Login Endpoint | N/A | Missing | N/A | Needs new endpoint |
| Order Status | OrderTracking | Simulated | N/A | Needs new endpoint |
| Update Profile | N/A | Missing | N/A | Needs new endpoint |

---

## 7. INTERFACE DEFINITIONS (Current)

**From `src/services/appsScript.ts`:**

```typescript
export interface SignupData {
  email: string;
  name: string;
  phone: string;
  location: string;
}

export interface OrderData {
  email: string;
  name: string;
  phone: string;
  location: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  scheduledTime?: string;
  timestamp: string;
}

export interface UserData {
  email: string;
  name: string;
  phone: string;
  locations: string[];
  verified: boolean;
}
```

---

## 8. IMPLEMENTATION CHECKLIST

### Phase 1: Authentication
- [ ] Update `src/services/appsScript.ts` with new backend URL
- [ ] Implement `sendSignup()` call in Auth.tsx
- [ ] Create new `login()` endpoint in service
- [ ] Implement login in Auth.tsx
- [ ] Test OTP flow (already working, verify compatibility)

### Phase 2: Orders
- [ ] Implement `saveOrder()` call in Checkout.tsx
- [ ] Implement `getOrderHistory()` call in OrderHistory.tsx (on mount)
- [ ] Create order status polling in OrderTracking.tsx
- [ ] Update interfaces if backend returns different structure

### Phase 3: Profile & Locations
- [ ] Fetch user profile in Profile.tsx on mount
- [ ] Implement profile update endpoint
- [ ] Implement `addLocation()` in LocationPicker.tsx
- [ ] Add location to profile flow

### Phase 4: Testing & Cleanup
- [ ] Remove all dummy data and simulated delays
- [ ] Add proper error handling for all endpoints
- [ ] Test CORS from frontend to new backend
- [ ] Verify all data flows

---

## 9. FILES TO MODIFY (Priority Order)

1. **`src/services/appsScript.ts`** - Update base URL, add new endpoints
2. **`src/pages/Auth.tsx`** - Implement signup and login
3. **`src/pages/Checkout.tsx`** - Implement order placement
4. **`src/pages/OrderHistory.tsx`** - Fetch orders on mount
5. **`src/pages/OrderTracking.tsx`** - Implement status polling
6. **`src/pages/Profile.tsx`** - Fetch and update profile
7. **`src/components/LocationPicker.tsx`** - Implement add location

---

## 10. CURRENT API ENDPOINTS USED

**From old backend (appsScript):**

```
POST /deploy (single endpoint with routing)
├── action: "signup"
├── action: "verifyOTP"
├── action: "getUser"
├── action: "addLocation"
├── action: "saveOrder"
└── action: "getOrders"
```

**Status:** Ready for mapping to new backend structure

---

**Next Step:** Provide the new backend endpoint structure and I'll update all files accordingly.
