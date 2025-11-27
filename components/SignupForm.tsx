import React, { useState } from 'react';
import { ArrowRight, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { CompactInput } from './CompactInput';
import { CompactSelect } from './CompactSelect';

interface FormData {
  // Page 1
  fullName: string;
  phone: string;
  email: string;
  businessType: string;
  // Page 2
  internationalPaymentHistory: string;
  volume: string;
  urgency: string;
}

type Step = 1 | 2 | 3; // 3 is success

export const SignupForm: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    businessType: '',
    internationalPaymentHistory: '',
    volume: '',
    urgency: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.businessType) newErrors.businessType = 'Please select type';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.internationalPaymentHistory) newErrors.internationalPaymentHistory = 'Please select an option';
    if (!formData.volume) newErrors.volume = 'Please select volume';
    if (!formData.urgency) newErrors.urgency = 'Please select timeframe';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      submitForm();
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form Submitted', { ...formData, timestamp: Date.now(), source: 'karbon-signup-page' });
      setIsSubmitting(false);
      setStep(3);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Render Success Screen
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full animate-fadeIn p-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
        <p className="text-slate-500 mb-6 max-w-xs">
          Thank you for choosing Karbon Business. Our team will review your details and contact you within 24 hours.
        </p>
        <div className="bg-white p-4 rounded-lg text-left w-full max-w-xs border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-700 mb-2">What happens next:</p>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
            <li>Review within 24 hours</li>
            <li>Onboarding documents via email</li>
            <li>Verification & Activation</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-emerald-600 font-medium text-sm hover:underline"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleNext} className="w-full flex flex-col h-full justify-center md:block">
      
      {/* Header Section */}
      <div className="mb-2 md:mb-6 text-center md:text-left shrink-0">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Step {step} of 2
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          {step === 1 ? 'Get Started' : 'Tell Us About Your Needs'}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          {step === 1 
            ? 'Start accepting international payments in 10 minutes.' 
            : 'Help us tailor the best solution for your business.'}
        </p>
      </div>

      {/* Form Fields Container */}
      <div className="flex flex-col gap-2 md:gap-4 shrink-0">
        
        {step === 1 && (
          <>
            <CompactInput
              label="Full Name"
              name="fullName"
              placeholder="John Smith"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
            <CompactInput
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <CompactInput
              label="Work Email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <CompactSelect
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              error={errors.businessType}
              placeholder="Select Type"
              required
              options={[
                { value: 'registered_company', label: 'A registered Company (Private Limited / LLP / OPC)' },
                { value: 'registered_firm', label: 'A registered Firm (Proprietorship / Partnership)' },
                { value: 'independent_professional', label: 'An Independent Professional (Freelancer)' },
              ]}
            />
          </>
        )}

        {step === 2 && (
          <>
            <CompactSelect
              label="Have you received international payments?"
              name="internationalPaymentHistory"
              value={formData.internationalPaymentHistory}
              onChange={handleChange}
              error={errors.internationalPaymentHistory}
              placeholder="Select Option"
              required
              options={[
                { value: 'regular', label: 'Yes, regularly' },
                { value: 'occasional', label: 'Yes, occasionally' },
                { value: 'new', label: 'No, but need to start' },
                { value: 'exploring', label: 'Just exploring options' },
              ]}
            />

            <CompactSelect
              label="Expected Monthly Payment Volume (USD)"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              error={errors.volume}
              placeholder="Select Volume"
              required
              options={[
                { value: 'tier1', label: 'Under $5,000' },
                { value: 'tier2', label: '$5,000 - $25,000' },
                { value: 'tier3', label: '$25,000 - $100,000' },
                { value: 'tier4', label: '$100,000 - $500,000' },
                { value: 'tier5', label: 'Over $500,000' },
              ]}
            />

            <CompactSelect
              label="When do you need to start receiving?"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              error={errors.urgency}
              placeholder="Select Timeframe"
              required
              options={[
                { value: 'immediate', label: 'Immediately (within 1 week)' },
                { value: '1_month', label: 'Within 1 month' },
                { value: '3_months', label: 'Within 3 months' },
                { value: 'research', label: 'Just researching' },
              ]}
            />
          </>
        )}

      </div>

      {/* Footer / Submit Section */}
      <div className="mt-4 md:mt-8 shrink-0">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 md:h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed group focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 outline-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : step === 1 ? (
            <>
              Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
};