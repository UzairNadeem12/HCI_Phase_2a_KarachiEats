const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  orders?: Order[];
  // Include other backend specific keys if necessary
  orderId?: string; 
  message?: string;
}

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
}

export interface Order {
  id: string;
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
  status: string;
}

// ----------------------------
// JSON REQUEST FUNCTION (FIXED)
// ----------------------------
const callApi = async <T>(action: string, payload: any = {}): Promise<ApiResponse<T>> => {
  try {
    // ⚠️ CRITICAL CHANGE: We DO NOT send 'Content-Type': 'application/json'
    // This allows the browser to skip the OPTIONS preflight check.
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      // No headers object here!
      body: JSON.stringify({ action, ...payload })
    });

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      return { success: false, error: "Server returned invalid response" };
    }

  } catch (err: any) {
    console.error("API Fetch Error:", err);
    return { success: false, error: err?.message || "Connection failed" };
  }
};

// ------------------------
// API FUNCTIONS
// ------------------------

// ✅ FIXED: Flattening data (removed { data: ... } wrapper)
// The backend expects 'email', 'name' at the root of the JSON body.
export const sendSignup = (data: SignupData) => 
  callApi("signup", data); 

export const verifyOTP = (email: string, otp: string) => 
  callApi("verifyOTP", { email, otp });

export const getUserData = (email: string) => 
  callApi("getUser", { email });

// ✅ FIXED: Flattening data here too
export const saveOrder = (orderData: OrderData) => 
  callApi("saveOrder", orderData); 

export const getOrderHistory = (email: string) => 
  callApi("getOrders", { email });

export const addLocation = (email: string, location: string) => 
  callApi("addLocation", { email, location });