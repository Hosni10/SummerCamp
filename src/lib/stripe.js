// Stripe configuration and utilities
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// In production, this should be stored in environment variables
const stripePromise = loadStripe('pk_test_51234567890abcdef'); // Replace with your actual publishable key

export { stripePromise };

// Utility function to create checkout session
export const createCheckoutSession = async (bookingData) => {
  try {
    // In a real application, this would call your backend API
    // For demo purposes, we'll simulate the checkout process
    
    const { plan, ...customerData } = bookingData;
    
    // Simulate API call to create Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: getPriceIdForPlan(plan.id),
        customerData,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Map plan IDs to Stripe price IDs
const getPriceIdForPlan = (planId) => {
  const priceMap = {
    1: 'price_1day_adventure', // Replace with actual Stripe price ID
    2: 'price_3day_explorer',  // Replace with actual Stripe price ID
    3: 'price_5day_champion',  // Replace with actual Stripe price ID
  };
  
  return priceMap[planId];
};

// Simulate payment processing for demo
export const simulatePayment = (bookingData) => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: 'pi_' + Math.random().toString(36).substr(2, 9),
        amount: bookingData.plan.price * 100, // Amount in cents
        currency: 'aed',
        customerEmail: bookingData.parentEmail,
      });
    }, 2000);
  });
};

