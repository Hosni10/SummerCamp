import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { X, Calendar, User, Phone, Mail, MapPin } from "lucide-react";

const BookingForm = ({ selectedPlan, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Parent Information
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentAddress: "",

    // Child Information
    childName: "",
    childAge: "",
    childGender: "",
    medicalConditions: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Camp Details
    startDate: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    console.log("Input changed:", field, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "parentName",
      "parentEmail",
      "parentPhone",
      "parentAddress",
      "childName",
      "childAge",
      "childGender",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.parentEmail && !/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      newErrors.parentEmail = "Please enter a valid email address";
    }

    // Phone validation (basic)
    if (formData.parentPhone && !/^\+?[\d\s-()]+$/.test(formData.parentPhone)) {
      newErrors.parentPhone = "Please enter a valid phone number";
    }

    // Age validation
    if (
      formData.childAge &&
      (parseInt(formData.childAge) < 6 || parseInt(formData.childAge) > 16)
    ) {
      newErrors.childAge = "Child age must be between 6 and 16";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (validateForm()) {
      console.log("Form is valid, submitting data:", {
        ...formData,
        plan: selectedPlan,
      });
      onSubmit({
        ...formData,
        plan: selectedPlan,
      });
    } else {
      console.log("Form validation failed:", errors);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Book Your Camp Adventure</CardTitle>
            <CardDescription>
              Complete the form below to register for {selectedPlan?.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {/* Selected Plan Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{selectedPlan?.name}</h3>
                <p className="text-gray-600">{selectedPlan?.description}</p>
              </div>
              <Badge className="bg-blue-600 text-white">
                AED {selectedPlan?.price}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Parent/Guardian Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Full Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
                    className={errors.parentName ? "border-red-500" : ""}
                  />
                  {errors.parentName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) =>
                      handleInputChange("parentEmail", e.target.value)
                    }
                    className={errors.parentEmail ? "border-red-500" : ""}
                  />
                  {errors.parentEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentEmail}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) =>
                      handleInputChange("parentPhone", e.target.value)
                    }
                    placeholder="+971 50 123 4567"
                    className={errors.parentPhone ? "border-red-500" : ""}
                  />
                  {errors.parentPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentPhone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentAddress">Address *</Label>
                  <Input
                    id="parentAddress"
                    value={formData.parentAddress}
                    onChange={(e) =>
                      handleInputChange("parentAddress", e.target.value)
                    }
                    className={errors.parentAddress ? "border-red-500" : ""}
                  />
                  {errors.parentAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Child Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Child Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childName">Child's Full Name *</Label>
                  <Input
                    id="childName"
                    value={formData.childName}
                    onChange={(e) =>
                      handleInputChange("childName", e.target.value)
                    }
                    className={errors.childName ? "border-red-500" : ""}
                  />
                  {errors.childName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.childName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="childAge">Age *</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("childAge", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.childAge ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => i + 6).map(
                        (age) => (
                          <SelectItem key={age} value={age.toString()}>
                            {age} years old
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {errors.childAge && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.childAge}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="childGender">Gender *</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("childGender", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.childGender ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.childGender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.childGender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {/* <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Contact
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className={errors.emergencyContact ? 'border-red-500' : ''}
                  />
                  {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+971 50 123 4567"
                    className={errors.emergencyPhone ? 'border-red-500' : ''}
                  />
                  {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                </div>
              </div>
            </div> */}

            {/* Special Requests */}
            {/* <div>
              <Label htmlFor="specialRequests">Special Requests or Comments</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requests or additional information you'd like us to know..."
                rows={3}
              />
            </div> */}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Proceed to Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
