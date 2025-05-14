"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContributionFormProps {
  campaignId: string;
  suggestedAmount: number;
  onCancel: () => void;
}

export default function ContributionForm({ campaignId, suggestedAmount, onCancel }: ContributionFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!email || !amount || !accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if the email is valid
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
      try {
      // Use the Heroku URL for the API
      const baseUrl = 'https://oims-4510ba404e0e.herokuapp.com';
      const response = await fetch(`${baseUrl}/app/oims/events/campaigns/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          email,
          amount: parseFloat(amount),
          paymentMethod,
          accountNumber
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contribution');
      }
      
      // Show success state
      setSubmitted(true);
      toast({
        title: "Contribution Submitted",
        description: "Thank you for your generous support!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem processing your contribution. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    setAmount(value);
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 p-6 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-4">Thank You for Your Contribution!</h3>
        <p className="text-green-600 mb-4">
          Your contribution of ${parseFloat(amount).toLocaleString()} has been received. 
          We appreciate your support in making this campaign a success.
        </p>
        <p className="text-green-600 mb-6">
          A confirmation email has been sent to {email}.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCancel}>
          Return to Campaign Details
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-blue-50">
      <h3 className="text-xl font-bold text-blue-800 mb-4">Make a Contribution</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="amount">Contribution Amount ($)</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              required
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Suggested contribution: ${suggestedAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <Label>Payment Method</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile-money" id="mobile-money" />
                <Label htmlFor="mobile-money">Mobile Money</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="accountNumber">
              {paymentMethod === 'credit-card' 
                ? 'Card Number' 
                : paymentMethod === 'bank-transfer' 
                  ? 'Bank Account Number' 
                  : 'Mobile Money Number'}
            </Label>
            <Input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={
                paymentMethod === 'credit-card' 
                  ? '1234 5678 9012 3456' 
                  : paymentMethod === 'bank-transfer' 
                    ? 'Enter account number' 
                    : 'Enter mobile number'
              }
              required
              className="mt-1"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Contribution'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
