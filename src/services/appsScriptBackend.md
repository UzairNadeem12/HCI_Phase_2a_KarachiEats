# Google Apps Script Backend Implementation

## Overview
This document explains how to set up the Google Apps Script backend to work with the API calls implemented in the frontend.

## Setup Instructions

### 1. Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Karachi Eats Backend"
3. Create the following sheets (tabs):
   - `Users`
   - `Orders`
   - `OTPs`

### 2. Set Up Sheet Columns

#### Users Sheet
- Column A: Email
- Column B: Name
- Column C: Phone
- Column D: Locations (comma-separated)
- Column E: Verified (TRUE/FALSE)
- Column F: Created At

#### Orders Sheet
- Column A: Order ID
- Column B: Email
- Column C: Name
- Column D: Phone
- Column E: Location
- Column F: Items (JSON string)
- Column G: Total
- Column H: Payment Method
- Column I: Scheduled Time
- Column J: Timestamp
- Column K: Status

#### OTPs Sheet
- Column A: Email
- Column B: OTP Code
- Column C: Created At
- Column D: Expires At

### 3. Create Apps Script Project

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy and paste the following code:

```javascript
// =====================================================
//                 KARACHI EATS BACKEND
// =====================================================

// ==================== CONFIGURATION ====================
const USERS_SHEET = 'Users';
const ORDERS_SHEET = 'Orders';
const OTPS_SHEET = 'OTPs';
const OTP_EXPIRY_MINUTES = 10;

// ==================== CORE HELPERS ====================

// CORS Response Wrapper
function corsResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// Success Wrapper
function success_(data = {}) {
  return { success: true, ...data };
}

// Error Wrapper
function error_(msg) {
  return { success: false, error: msg };
}

// Ensure Sheet Exists
function ensureSheet_(name) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) throw new Error(`Sheet not found: ${name}`);
  return sheet;
}

// Local Time (Pakistan Standard Time)
function localTimeISO_() {
  const now = new Date();
  return Utilities.formatDate(now, "Asia/Karachi", "yyyy-MM-dd HH:mm:ss");
}

function generateOTP_() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOrderId_() {
  return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 900);
}

// Email OTP Sender
function sendOTPEmail_(email, otp) {
  try {
    MailApp.sendEmail(
      email,
      "Your Karachi Eats Verification Code",
      `Your OTP code is: ${otp}\nIt will expire in ${OTP_EXPIRY_MINUTES} minutes.`
    );
    return true;
  } catch (e) {
    Logger.log("Email error: " + e);
    return false;
  }
}

// =====================================================
//               USER MANAGEMENT
// =====================================================

function signup_(data) {
  const usersSheet = ensureSheet_(USERS_SHEET);
  const otpsSheet = ensureSheet_(OTPS_SHEET);

  const allUsers = usersSheet.getDataRange().getValues();

  // Check duplicate user
  for (let i = 1; i < allUsers.length; i++) {
    if (allUsers[i][0] === data.email) return error_("User already exists");
  }

  const otp = generateOTP_();
  const now = localTimeISO_();

  // Calculate expiry
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

  // Save OTP
  otpsSheet.appendRow([data.email, otp, now, expiresAt.toISOString()]);

  // Save user (unverified)
  usersSheet.appendRow([
    data.email,
    data.name,
    data.phone,
    data.location || "",
    false, // verified?
    now
  ]);

  // Send OTP Email
  if (!sendOTPEmail_(data.email, otp)) {
    return error_("Failed to send OTP email");
  }

  return success_();
}

function verifyOTP_(email, otp) {
  const otpsSheet = ensureSheet_(OTPS_SHEET);
  const usersSheet = ensureSheet_(USERS_SHEET);
  const now = new Date();

  const otpRows = otpsSheet.getDataRange().getValues();

  for (let i = otpRows.length - 1; i >= 1; i--) {
    if (otpRows[i][0] === email && otpRows[i][1] === otp) {
      const expiry = new Date(otpRows[i][3]);

      if (now > expiry) return error_("OTP expired");

      // Mark verified
      const users = usersSheet.getDataRange().getValues();
      for (let j = 1; j < users.length; j++) {
        if (users[j][0] === email) {
          usersSheet.getRange(j + 1, 5).setValue(true);
          otpsSheet.deleteRow(i + 1);
          return success_();
        }
      }
    }
  }

  return error_("Invalid OTP");
}

function getUser_(email) {
  const sheet = ensureSheet_(USERS_SHEET);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      return success_({
        email: data[i][0],
        name: data[i][1],
        phone: data[i][2],
        locations: data[i][3] ? data[i][3].split(",") : [],
        verified: data[i][4]
      });
    }
  }

  return error_("User not found");
}

function addLocation_(email, location) {
  const sheet = ensureSheet_(USERS_SHEET);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      const locs = data[i][3] ? data[i][3].split(",") : [];
      if (!locs.includes(location)) {
        locs.push(location);
        sheet.getRange(i + 1, 4).setValue(locs.join(","));
      }
      return success_();
    }
  }

  return error_("User not found");
}

// =====================================================
//                  ORDER MANAGEMENT
// =====================================================

function saveOrder_(orderData) {
  const sheet = ensureSheet_(ORDERS_SHEET);
  const id = generateOrderId_();

  sheet.appendRow([
    id,
    orderData.email,
    orderData.name,
    orderData.phone,
    orderData.location,
    JSON.stringify(orderData.items || []),
    orderData.total,
    orderData.paymentMethod,
    orderData.scheduledTime || "",
    localTimeISO_(),
    "pending"
  ]);

  return success_({ orderId: id });
}

function getOrders_(email) {
  const sheet = ensureSheet_(ORDERS_SHEET);
  const rows = sheet.getDataRange().getValues();

  const orders = [];

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) {
      orders.push({
        id: rows[i][0],
        email: rows[i][1],
        name: rows[i][2],
        phone: rows[i][3],
        location: rows[i][4],
        items: JSON.parse(rows[i][5]),
        total: rows[i][6],
        paymentMethod: rows[i][7],
        scheduledTime: rows[i][8],
        timestamp: rows[i][9],
        status: rows[i][10]
      });
    }
  }

  return success_({ orders });
}

// =====================================================
//                MAIN ROUTING (CORS INCLUDED)
// =====================================================

function doOptions() {
  return HtmlService.createHtmlOutput("")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    const routers = {
      signup: () => signup_(data.data),
      verifyOTP: () => verifyOTP_(data.email, data.otp),
      getUser: () => getUser_(data.email),
      addLocation: () => addLocation_(data.email, data.location),
      saveOrder: () => saveOrder_(data.data),
      getOrders: () => getOrders_(data.email)
    };

    if (!routers[action]) return corsResponse_(error_("Invalid action"));

    return corsResponse_(routers[action]());
  } catch (err) {
    Logger.log("doPost error: " + err);
    return corsResponse_(error_(err.toString()));
  }
}

function doGet() {
  return corsResponse_({ status: "Karachi Eats API Running" });
}
```

### 4. Deploy as Web App

1. Click on the **Deploy** button in the Apps Script editor
2. Select **New deployment**
3. Click the gear icon next to "Select type" and choose **Web app**
4. Configure:
   - Description: "Karachi Eats Backend API"
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**
6. Copy the **Web app URL** (you'll need this for the frontend)
7. Update `src/services/appsScript.ts` - replace `YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE` with your deployment URL

### 5. Set Up Email Sending (Optional but Recommended)

The script uses `MailApp.sendEmail()` which sends emails from your Google account. Make sure:
- Your Google account has email sending enabled
- You're comfortable with emails being sent from your account
- You can customize the email template in the `sendOTPEmail()` function

### 6. Test the API

You can test the deployment by:
1. Visit the Web app URL in your browser - you should see "API is working"
2. Use the frontend app to test signup and OTP verification

## API Endpoints Summary

All requests are POST requests to the deployment URL with JSON body:

### Signup
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

### Verify OTP
```json
{
  "action": "verifyOTP",
  "email": "user@example.com",
  "otp": "123456"
}
```

### Get User Data
```json
{
  "action": "getUser",
  "email": "user@example.com"
}
```

### Save Order
```json
{
  "action": "saveOrder",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0300-1234567",
    "location": "Karachi, Pakistan",
    "items": [...],
    "total": 500,
    "paymentMethod": "cash",
    "scheduledTime": "",
    "timestamp": "2025-01-20T10:00:00Z"
  }
}
```

### Get Orders
```json
{
  "action": "getOrders",
  "email": "user@example.com"
}
```

### Add Location
```json
{
  "action": "addLocation",
  "email": "user@example.com",
  "location": "New address"
}
```

## Security Notes

- The API is open to anyone with the URL - consider adding authentication tokens for production
- OTPs expire after 10 minutes
- Used OTPs are automatically deleted
- Email addresses are used as unique identifiers

## Troubleshooting

If you encounter issues:
1. Check the Apps Script execution logs (View > Executions)
2. Ensure the sheet names match exactly
3. Verify the deployment URL is correct
4. Check that email sending permissions are granted
5. Test the API with the built-in test functions in Apps Script
