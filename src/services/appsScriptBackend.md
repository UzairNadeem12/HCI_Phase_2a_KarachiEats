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
// ==================== CONFIGURATION ====================
const USERS_SHEET = 'Users';
const ORDERS_SHEET = 'Orders';
const OTPS_SHEET = 'OTPs';
const OTP_EXPIRY_MINUTES = 10;

// ==================== UTILITY FUNCTIONS ====================

function getSheetByName(sheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOrderId() {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
}

function sendOTPEmail(email, otp) {
  const subject = 'Your Karachi Eats Verification Code';
  const body = `Your OTP code is: ${otp}\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you didn't request this code, please ignore this email.`;
  
  try {
    MailApp.sendEmail(email, subject, body);
    return true;
  } catch (e) {
    Logger.log('Error sending email: ' + e.toString());
    return false;
  }
}

// ==================== USER MANAGEMENT ====================

function handleSignup(data) {
  const usersSheet = getSheetByName(USERS_SHEET);
  const otpsSheet = getSheetByName(OTPS_SHEET);
  
  // Check if user already exists
  const existingUsers = usersSheet.getDataRange().getValues();
  for (let i = 1; i < existingUsers.length; i++) {
    if (existingUsers[i][0] === data.email) {
      return { success: false, error: 'User already exists' };
    }
  }
  
  // Generate OTP
  const otp = generateOTP();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60000);
  
  // Save OTP
  otpsSheet.appendRow([
    data.email,
    otp,
    now.toISOString(),
    expiresAt.toISOString()
  ]);
  
  // Save user (unverified)
  usersSheet.appendRow([
    data.email,
    data.name,
    data.phone,
    data.location,
    false, // Not verified yet
    now.toISOString()
  ]);
  
  // Send OTP email
  const emailSent = sendOTPEmail(data.email, otp);
  
  if (!emailSent) {
    return { success: false, error: 'Failed to send OTP email' };
  }
  
  return { success: true };
}

function handleVerifyOTP(email, otp) {
  const otpsSheet = getSheetByName(OTPS_SHEET);
  const usersSheet = getSheetByName(USERS_SHEET);
  
  const otpData = otpsSheet.getDataRange().getValues();
  const now = new Date();
  
  // Find matching OTP
  for (let i = otpData.length - 1; i >= 1; i--) {
    if (otpData[i][0] === email && otpData[i][1] === otp) {
      const expiresAt = new Date(otpData[i][3]);
      
      if (now > expiresAt) {
        return { success: false, error: 'OTP has expired' };
      }
      
      // Mark user as verified
      const userData = usersSheet.getDataRange().getValues();
      for (let j = 1; j < userData.length; j++) {
        if (userData[j][0] === email) {
          usersSheet.getRange(j + 1, 5).setValue(true);
          
          // Delete used OTP
          otpsSheet.deleteRow(i + 1);
          
          return { success: true };
        }
      }
    }
  }
  
  return { success: false, error: 'Invalid OTP' };
}

function handleGetUser(email) {
  const usersSheet = getSheetByName(USERS_SHEET);
  const userData = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < userData.length; i++) {
    if (userData[i][0] === email) {
      return {
        success: true,
        data: {
          email: userData[i][0],
          name: userData[i][1],
          phone: userData[i][2],
          locations: userData[i][3] ? userData[i][3].split(',') : [],
          verified: userData[i][4]
        }
      };
    }
  }
  
  return { success: false, error: 'User not found' };
}

function handleAddLocation(email, location) {
  const usersSheet = getSheetByName(USERS_SHEET);
  const userData = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < userData.length; i++) {
    if (userData[i][0] === email) {
      const currentLocations = userData[i][3] ? userData[i][3].split(',') : [];
      if (!currentLocations.includes(location)) {
        currentLocations.push(location);
        usersSheet.getRange(i + 1, 4).setValue(currentLocations.join(','));
      }
      return { success: true };
    }
  }
  
  return { success: false, error: 'User not found' };
}

// ==================== ORDER MANAGEMENT ====================

function handleSaveOrder(orderData) {
  const ordersSheet = getSheetByName(ORDERS_SHEET);
  const orderId = generateOrderId();
  
  ordersSheet.appendRow([
    orderId,
    orderData.email,
    orderData.name,
    orderData.phone,
    orderData.location,
    JSON.stringify(orderData.items),
    orderData.total,
    orderData.paymentMethod,
    orderData.scheduledTime || '',
    orderData.timestamp,
    'pending'
  ]);
  
  return { success: true, orderId: orderId };
}

function handleGetOrders(email) {
  const ordersSheet = getSheetByName(ORDERS_SHEET);
  const ordersData = ordersSheet.getDataRange().getValues();
  const orders = [];
  
  for (let i = 1; i < ordersData.length; i++) {
    if (ordersData[i][1] === email) {
      orders.push({
        id: ordersData[i][0],
        email: ordersData[i][1],
        name: ordersData[i][2],
        phone: ordersData[i][3],
        location: ordersData[i][4],
        items: JSON.parse(ordersData[i][5]),
        total: ordersData[i][6],
        paymentMethod: ordersData[i][7],
        scheduledTime: ordersData[i][8],
        timestamp: ordersData[i][9],
        status: ordersData[i][10]
      });
    }
  }
  
  return { success: true, orders: orders };
}

// ==================== MAIN HANDLER ====================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    switch (data.action) {
      case 'signup':
        return ContentService.createTextOutput(
          JSON.stringify(handleSignup(data.data))
        ).setMimeType(ContentService.MimeType.JSON);
        
      case 'verifyOTP':
        return ContentService.createTextOutput(
          JSON.stringify(handleVerifyOTP(data.email, data.otp))
        ).setMimeType(ContentService.MimeType.JSON);
        
      case 'getUser':
        return ContentService.createTextOutput(
          JSON.stringify(handleGetUser(data.email))
        ).setMimeType(ContentService.MimeType.JSON);
        
      case 'addLocation':
        return ContentService.createTextOutput(
          JSON.stringify(handleAddLocation(data.email, data.location))
        ).setMimeType(ContentService.MimeType.JSON);
        
      case 'saveOrder':
        return ContentService.createTextOutput(
          JSON.stringify(handleSaveOrder(data.data))
        ).setMimeType(ContentService.MimeType.JSON);
        
      case 'getOrders':
        return ContentService.createTextOutput(
          JSON.stringify(handleGetOrders(data.email))
        ).setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(
          JSON.stringify({ success: false, error: 'Invalid action' })
        ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// For testing
function doGet(e) {
  return ContentService.createTextOutput('API is working');
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
