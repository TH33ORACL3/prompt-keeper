import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { RadioGroup, RadioGroupItem } from './ui/RadioGroup';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Check, CreditCard, AlertCircle, Settings, Shield, Star, Zap, Clock } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features for personal use',
    price: 'Free',
    features: [
      'Up to 15 prompts',
      'Up to 3 collections',
      'Discord support',
    ],
    limitations: [
      'Limited prompt history',
      'No priority support',
      'No early access features',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced features for power users',
    price: '$4/month',
    yearlyPrice: '$40/year',
    features: [
      'Unlimited prompts',
      'Unlimited collections',
      'Priority support',
      'Prompt Generator',
      'Early access to new features',
      'Advanced analytics',
      'Version history',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    popular: true,
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Collaboration features for teams',
    price: '$10/month',
    yearlyPrice: '$100/year',
    features: [
      'Everything in Pro',
      'Team sharing & collaboration',
      'Shared prompt libraries',
      'Team analytics',
      'Admin controls',
      'SSO Authentication',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  }
];

const PaymentMethod = ({ id, name, last4, expiry, isDefault, type }) => {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${isDefault ? 'border-primary' : 'border-border'}`}>
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">
            {name} {isDefault && <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 ml-2">Default</span>}
          </p>
          <p className="text-sm text-muted-foreground">•••• •••• •••• {last4} • Expires {expiry}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">Edit</Button>
        {!isDefault && <Button variant="outline" size="sm">Set as default</Button>}
      </div>
    </div>
  );
};

const BillingHistoryItem = ({ date, amount, status, invoice }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div>
        <p className="font-medium">{date}</p>
        <p className="text-sm text-muted-foreground">Invoice #{invoice}</p>
      </div>
      <div className="flex items-center space-x-4">
        <p className="font-medium">${amount}</p>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
          ${status === 'Paid' ? 'bg-green-100 text-green-800' : 
          status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'}`}>
          {status}
        </span>
        <Button variant="ghost" size="sm">Download</Button>
      </div>
    </div>
  );
};

const FeatureItem = ({ children, included = true }) => (
  <div className="flex items-center">
    <div className={`mr-2 h-5 w-5 rounded-full flex items-center justify-center ${included ? 'text-primary' : 'text-muted-foreground'}`}>
      {included ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
    </div>
    <span className={`text-sm ${included ? '' : 'text-muted-foreground line-through'}`}>{children}</span>
  </div>
);

const PlanCard = ({ plan, selected, onSelect, billingCycle }) => {
  const price = billingCycle === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
  const isCurrentPlan = plan.id === 'free'; // This would be dynamic based on user's subscription

  return (
    <Card className={`relative flex flex-col h-full ${plan.highlight ? 'border-primary shadow-md' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-24 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground text-center">
          Popular
        </div>
      )}
      <CardHeader className={`pb-8 ${plan.popular ? 'pt-8' : 'pt-6'}`}>
        <CardTitle className="flex items-center">
          {plan.name}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {billingCycle === 'yearly' && plan.yearlyPrice && (
            <span className="ml-2 text-sm text-muted-foreground">Save 15%</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-2">
          {plan.features.map((feature, i) => (
            <FeatureItem key={i}>{feature}</FeatureItem>
          ))}
          {plan.limitations.map((limitation, i) => (
            <FeatureItem key={`limit-${i}`} included={false}>{limitation}</FeatureItem>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        {isCurrentPlan ? (
          <Button disabled className="w-full" variant="outline">Current Plan</Button>
        ) : (
          <Button 
            className="w-full" 
            variant={plan.highlight ? "default" : "outline"}
            onClick={() => onSelect(plan.id)}
          >
            {plan.cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState('free');

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleBillingCycleChange = (value) => {
    setBillingCycle(value);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing settings
        </p>
      </div>

      {/* Current plan overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the Free plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Plan Details</h3>
              </div>
              <p className="text-2xl font-bold">Free</p>
              <p className="text-sm text-muted-foreground">Basic features for personal use</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Usage</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm">10 of 15 prompts used</p>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '66%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm">2 of 3 collections used</p>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '66%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Renewal</h3>
              </div>
              <p className="text-sm">Your free plan doesn't have a renewal date</p>
              <Button variant="default" className="mt-2">
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing interval selection */}
      <div className="space-y-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-1">Billing Interval</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred billing period
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <RadioGroup 
            className="flex space-x-4" 
            defaultValue={billingCycle}
            onValueChange={handleBillingCycleChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yearly" id="yearly" />
              <Label htmlFor="yearly">Yearly (Save 15%)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            selected={selectedPlanId === plan.id}
            onSelect={handlePlanSelect}
            billingCycle={billingCycle}
          />
        ))}
      </div>

      {/* Payment methods */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <PaymentMethod 
            id="card1"
            name="VISA"
            last4="4242"
            expiry="12/25"
            isDefault={true}
            type="card"
          />
          <PaymentMethod 
            id="card2"
            name="Mastercard"
            last4="8888"
            expiry="09/24"
            isDefault={false}
            type="card"
          />
          <div className="mt-4">
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </div>
      </div>

      {/* Billing history */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <Card>
          <CardContent className="pt-6">
            <BillingHistoryItem 
              date="Aug 1, 2023"
              amount="4.00"
              status="Paid"
              invoice="INV-2023-001"
            />
            <BillingHistoryItem 
              date="Jul 1, 2023"
              amount="4.00"
              status="Paid"
              invoice="INV-2023-002"
            />
            <BillingHistoryItem 
              date="Jun 1, 2023"
              amount="4.00"
              status="Paid"
              invoice="INV-2023-003"
            />
          </CardContent>
          <CardFooter className="flex justify-center border-t">
            <Button variant="ghost" size="sm">
              View All Invoices
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Subscription; 