import express from "express";
import cors from "cors";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2023-10-16",
    typescript: true,
  }
);

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Create payment intent endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    console.log("Received payment intent request:", req.body);
    const { amount, currency, metadata } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({
        error: "Amount and currency are required",
      });
    }

    console.log("Creating payment intent with:", {
      amount,
      currency,
      metadata,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      payment_method_types: ["card"],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "always",
      },
    });

    console.log("Payment intent created:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(err.statusCode || 500).json({
      error: err.message,
      type: err.type,
      code: err.code,
    });
  }
});

// Add a test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/api/test`);
});
