import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge.jsx";
import { CheckCircle, XCircle, CreditCard, Loader2 } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  apiVersion: "2023-10-16",
});

const PaymentForm = ({ bookingData, onSuccess, onCancel, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Payment form submitted");

    if (!stripe || !elements || !paymentElementReady) {
      console.log("Stripe not ready:", {
        stripe: !!stripe,
        elements: !!elements,
        paymentElementReady,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Confirming payment...");

      const { error: submitError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
          },
          redirect: "if_required",
        }
      );

      console.log("Payment confirmation result:", {
        submitError,
        paymentIntent,
      });

      if (submitError) {
        console.error("Payment error:", submitError);
        throw new Error(submitError.message);
      }

      if (paymentIntent) {
        console.log("Payment intent status:", paymentIntent.status);

        if (paymentIntent.status === "succeeded") {
          console.log("Payment succeeded");
          onSuccess({
            paymentId: paymentIntent.id,
            amount: bookingData.plan.price,
            currency: "aed",
          });
        } else if (paymentIntent.status === "requires_action") {
          console.log("Payment requires action");
          const { error: actionError } = await stripe.handleCardAction(
            paymentIntent.client_secret
          );
          if (actionError) {
            throw new Error(actionError.message);
          }
          onSuccess({
            paymentId: paymentIntent.id,
            amount: bookingData.plan.price,
            currency: "aed",
          });
        } else {
          throw new Error(`Unexpected payment status: ${paymentIntent.status}`);
        }
      } else {
        throw new Error("No payment intent returned");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-700">
              Payment Failed
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => setError(null)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <p>Plan: {bookingData.plan.name}</p>
            <p>Child: {bookingData.childName}</p>
            <p className="text-lg font-bold mt-2">
              Total: AED {bookingData.plan.price}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="border rounded-lg p-4 mb-4">
              <PaymentElement
                onReady={() => {
                  console.log("Payment element ready");
                  setPaymentElementReady(true);
                }}
                options={{
                  layout: {
                    type: "tabs",
                    defaultCollapsed: false,
                  },
                  fields: {
                    billingDetails: {
                      name: "auto",
                      email: "auto",
                      phone: "auto",
                      address: "auto",
                    },
                  },
                  paymentMethodOrder: ["card"],
                }}
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || !stripe || !elements || !paymentElementReady
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentProcessor = ({ bookingData, onSuccess, onCancel, onError }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Creating payment intent...");

        const response = await fetch(
          "http://localhost:3000/api/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: bookingData.plan.price * 100,
              currency: "aed",
              metadata: {
                childName: bookingData.childName,
                planName: bookingData.plan.name,
                email: bookingData.parentEmail,
              },
            }),
          }
        );

        const data = await response.json();
        console.log("Payment intent response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Payment failed");
        }

        if (mounted) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        if (mounted) {
          setError(err.message);
          onError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    createPaymentIntent();

    return () => {
      mounted = false;
    };
  }, [bookingData]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <CardTitle>Loading payment form...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-700">
              Error Loading Payment Form
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#2563eb",
              colorBackground: "#ffffff",
              colorText: "#1f2937",
              colorDanger: "#ef4444",
              fontFamily: "system-ui, sans-serif",
              spacingUnit: "4px",
              borderRadius: "8px",
            },
          },
        }}
      >
        <PaymentForm
          bookingData={bookingData}
          onSuccess={onSuccess}
          onCancel={onCancel}
          onError={onError}
        />
      </Elements>
    </div>
  );
};

export default PaymentProcessor;
