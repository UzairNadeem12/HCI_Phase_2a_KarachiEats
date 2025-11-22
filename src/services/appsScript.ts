// Google Apps Script API Service
// This service handles all communication with the Google Sheets backend

const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE';

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

// Send signup request and trigger OTP
export const sendSignup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signup',
        data,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to connect to server' };
  }
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verifyOTP',
        email,
        otp,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to verify OTP' };
  }
};

// Get user data by email
export const getUserData = async (email: string): Promise<{ success: boolean; data?: UserData; error?: string }> => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getUser',
        email,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to fetch user data' };
  }
};

// Save order
export const saveOrder = async (orderData: OrderData): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveOrder',
        data: orderData,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to save order' };
  }
};

// Get order history by email
export const getOrderHistory = async (email: string): Promise<{ success: boolean; orders?: any[]; error?: string }> => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getOrders',
        email,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to fetch order history' };
  }
};

// Add location to user profile
export const addLocation = async (email: string, location: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addLocation',
        email,
        location,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to add location' };
  }
};
