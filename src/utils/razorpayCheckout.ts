// Razorpay Standard Checkout SDK Loader & Integration Utility for SAMZEN Web Development

export interface RazorpayOptions {
  key: string;
  amount: number | string; // in paise (e.g. 199900 = ₹1,999)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

/**
 * Dynamically loads the Razorpay checkout SDK script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay Standard Payment Checkout
 */
export const initiateRazorpayCheckout = async (config: {
  amountInRupees: number;
  planName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: (errorMsg: string) => void;
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    if (config.onFailure) config.onFailure('Failed to load Razorpay SDK. Check internet connection.');
    return;
  }

  // Get key from environment variable or fallback to test key placeholder
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';

  const options: RazorpayOptions = {
    key: keyId,
    amount: Math.round(config.amountInRupees * 100), // convert to paise
    currency: 'INR',
    name: 'SAMZEN Web Development',
    description: `${config.planName} - Online Payment`,
    image: 'https://samzen.ai.studio/logo.png',
    handler: (response) => {
      config.onSuccess(response.razorpay_payment_id);
    },
    prefill: {
      name: config.customerName || '',
      email: config.customerEmail || '',
      contact: config.customerPhone || ''
    },
    theme: {
      color: '#00f2fe'
    },
    modal: {
      ondismiss: () => {
        if (config.onFailure) config.onFailure('Payment checkout was closed by user.');
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err: any) {
    if (config.onFailure) config.onFailure(err?.message || 'Error opening Razorpay payment modal.');
  }
};
