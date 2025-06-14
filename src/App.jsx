import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Star, Users, Trophy, Clock, MapPin, Phone, Mail } from "lucide-react";
import heroImage from "./assets/hero-sports-camp.jpg";
import afcLogo from "./assets/afc-logo.svg";
import BookingForm from "./components/BookingForm.jsx";
import PaymentProcessor from "./components/PaymentProcessor.jsx";
import "./App.css";

function App() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const pricingPlans = [
    {
      id: 1,
      name: "1-Day Adventure",
      price: 150,
      duration: "1 Day",
      description: "Perfect for trying out our multi-sport experience",
      features: [
        "3 different sports activities",
        "Professional coaching",
        "Lunch included",
        "All equipment provided",
        "Certificate of participation",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "3-Day Explorer",
      price: 400,
      duration: "3 Days",
      description: "Dive deeper into various sports and build new skills",
      features: [
        "6+ different sports activities",
        "Professional coaching",
        "Daily lunch included",
        "All equipment provided",
        "Skills assessment",
        "Photo memories package",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "5-Day Champion",
      price: 650,
      duration: "5 Days",
      description: "Complete immersion in our multi-sport program",
      features: [
        "10+ different sports activities",
        "Professional coaching",
        "Daily lunch included",
        "All equipment provided",
        "Skills assessment",
        "Photo memories package",
        "Camp t-shirt",
        "Achievement awards",
      ],
      popular: false,
    },
  ];

  const handleBookNow = (plan) => {
    setSelectedPlan(plan);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedPlan(null);
  };

  const handleBookingSubmit = (formData) => {
    console.log("Booking form submitted:", formData);
    // Store booking data and proceed to payment
    setBookingData(formData);
    setShowBookingForm(false);
    setShowPaymentProcessor(true);
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log("Payment successful:", paymentResult);
    // Payment successful
    setShowPaymentProcessor(false);
    setSelectedPlan(null);
    setBookingData(null);

    // Show success message in a modal
    const successMessage = document.createElement("div");
    successMessage.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50";
    successMessage.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p class="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <div class="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <p class="text-sm text-gray-600">Payment ID: ${paymentResult.paymentId}</p>
            <p class="text-sm text-gray-600">Amount: AED ${paymentResult.amount}</p>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(successMessage);
  };

  const handlePaymentCancel = () => {
    console.log("Payment cancelled");
    // User cancelled payment, go back to booking form
    setShowPaymentProcessor(false);
    setShowBookingForm(true);
  };

  const handlePaymentError = (error) => {
    console.log("Payment error:", error);
    // Payment failed
    setShowPaymentProcessor(false);
    alert(`Payment failed: ${error.message}. Please try again.`);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src={afcLogo} alt="AFC SportsCamp" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">
                SportsCamp UAE
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              Summer 2025 Registration Open
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Multi-Sport Summer Camp
              <span className="block text-yellow-300">Adventure Awaits!</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join us for an unforgettable summer experience where your child
              will explore football, basketball, tennis, swimming, and many more
              sports in a safe, fun, and professional environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Users className="h-5 w-5 text-yellow-300" />
              <span>Ages 6-16</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="h-5 w-5 text-yellow-300" />
              <span>9 AM - 4 PM</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <MapPin className="h-5 w-5 text-yellow-300" />
              <span>Dubai, UAE</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() =>
              document
                .getElementById("pricing")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Book Your Spot Now
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Summer Camp?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive multi-sport experience that builds
              confidence, teamwork, and athletic skills in a fun and supportive
              environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>Professional Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our certified coaches bring years of experience and passion
                  for youth development.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Small Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maximum 12 kids per group ensures personalized attention and
                  better learning.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Multi-Sport Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  From football to tennis, swimming to basketball - explore 10+
                  different sports!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-lg text-gray-600">
              Flexible plans to fit your schedule and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      AED {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-green-500 fill-current" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-auto ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-900"
                    } text-white`}
                    onClick={() => handleBookNow(plan)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2">
              <Phone className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold">Call Us</h3>
              <p className="text-gray-600">+971 50 123 4567</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Mail className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold">Email Us</h3>
              <p className="text-gray-600">info@sportscamp-uae.com</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <MapPin className="h-8 w-8 text-orange-600" />
              <h3 className="font-semibold">Visit Us</h3>
              <p className="text-gray-600">Dubai Sports City, UAE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-6 w-6" />
            <span className="text-lg font-semibold">SportsCamp UAE</span>
          </div>
          <p className="text-gray-400 mb-4">
            Creating champions through sports, building character through play.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 SportsCamp UAE. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          selectedPlan={selectedPlan}
          onClose={handleCloseBookingForm}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Payment Processor Modal */}
      {showPaymentProcessor && bookingData && (
        <PaymentProcessor
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
}

export default App;
