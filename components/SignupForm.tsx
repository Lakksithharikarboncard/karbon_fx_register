// components/SignupForm.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { CompactInput } from './CompactInput';
import { CompactSelect } from './CompactSelect';
import {
  upsertAirtableRecord,
  buildSourceString,
  getSearchKeyword,
  getUserIP,
  getFullReferrer,
  getUserAgent,
  getTimestamp,
} from '../utils/airtable';

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

type Step = 1 | 2 | 3; // 3 = success screen

// Helper function to get readable label from select value
const getReadableLabel = (fieldName: string, value: string): string => {
  const optionsMap: Record<string, Record<string, string>> = {
    businessType: {
      'private_limited': 'Private Limited Company',
      'llp': 'Limited Liability Partnership (LLP)',
      'sole_proprietorship': 'Sole Proprietorship',
      'freelancer': 'Freelancer',
    },
    internationalPaymentHistory: {
      'regular': 'Yes, regularly',
      'occasional': 'Yes, occasionally',
      'new': 'No, but I need to start',
      'exploring': 'Just exploring options',
    },
    volume: {
      'tier1': 'Under $1,000',
      'tier2': '$1,000 - $10,000',
      'tier3': '$10,000 - $50,000',
      'tier4': '$50,000 - $100,000',
      'tier5': 'Over $100,000',
    },
    urgency: {
      'immediate': 'Immediately (within 1 week)',
      '1_month': 'Within 1 month',
      '3_months': 'Within 3 months',
      'research': 'Just researching',
    },
  };

  return optionsMap[fieldName]?.[value] || value;
};

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

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStep1Submitting, setIsStep1Submitting] = useState(false);
  const [airtableRecordId, setAirtableRecordId] = useState<string | undefined>(
    undefined
  );
  const [userIP, setUserIP] = useState<string>('');

  // Fetch IP on component mount
  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };
    fetchIP();
  }, []);

  // ---------- Validation ----------

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    // Phone validation: must be exactly 10 digits
    const phoneRaw = formData.phone.trim();

    if (!phoneRaw) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneRaw)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.internationalPaymentHistory) {
      newErrors.internationalPaymentHistory = 'Please select an option';
    }
    if (!formData.volume) {
      newErrors.volume = 'Please select volume';
    }
    if (!formData.urgency) {
      newErrors.urgency = 'Please select timeframe';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Handlers ----------

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        // Capture Step 1 data immediately to Airtable
        setIsStep1Submitting(true);

        const step1Data = {
          name: formData.fullName,
          phone_number: `+91${formData.phone}`,
          email: formData.email,
          business_type: getReadableLabel('businessType', formData.businessType),
          source: buildSourceString(),
          keyword: getSearchKeyword() || '',
          ip_address: userIP,
          referrer: getFullReferrer(),
          user_agent: getUserAgent(),
          timestamp: getTimestamp(),
        };

        const result = await upsertAirtableRecord(step1Data);

        if (result.success && result.recordId) {
          setAirtableRecordId(result.recordId);
          console.log('Step 1 captured:', result.recordId);
        } else {
          console.error('Failed to capture Step 1:', result.error);
        }

        setIsStep1Submitting(false);
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        submitForm();
      }
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    // Complete data with Step 2 fields - all human-readable
    const completeData = {
      name: formData.fullName,
      phone_number: `+91${formData.phone}`,
      email: formData.email,
      business_type: getReadableLabel('businessType', formData.businessType),
      previous_experience: getReadableLabel('internationalPaymentHistory', formData.internationalPaymentHistory),
      monthly_volume: getReadableLabel('volume', formData.volume),
      start_receiving_at: getReadableLabel('urgency', formData.urgency),
      source: buildSourceString(),
      keyword: getSearchKeyword() || '',
      ip_address: userIP,
      referrer: getFullReferrer(),
      user_agent: getUserAgent(),
      timestamp: getTimestamp(),
    };

    // Update existing record or create new one
    const result = await upsertAirtableRecord(completeData, airtableRecordId);

    if (result.success) {
      console.log('Form submitted successfully:', result.recordId);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
      }, 1000);
    } else {
      console.error('Submission failed:', result.error);
      setIsSubmitting(false);
      alert('Submission failed. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  // Dedicated handler for phone to allow only digits and max 10 chars
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ''); // keep digits only
    const limited = raw.slice(0, 10); // max 10 digits
    setFormData(prev => ({ ...prev, phone: limited }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  // ---------- Success Screen ----------

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full px-6 py-8 animate-fadeIn">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#0657d0]/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#0657d0] to-[#0f1f3d] rounded-full flex items-center justify-center shadow-2xl shadow-[#0657d0]/20">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1f3d] mb-3 leading-tight">
          Application Submitted!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mb-12 max-w-md leading-relaxed">
          Welcome to Karbon Business. Our team will review your application and
          reach out within{' '}
          <span className="font-semibold text-[#0f1f3d]">24 hours</span>.
        </p>

        {/* What Happens Next - List Style */}
        <div className="w-full max-w-md space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-[#0657d0]/5 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#0657d0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-bold text-[#0f1f3d] mb-1">
                Application Review
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our team reviews your details within 24 hours
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-[#0657d0]/5 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#0657d0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-bold text-[#0f1f3d] mb-1">
                Onboarding Call
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Immediate onboarding call with our growth team to get you started
              </p>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-10 text-sm font-semibold text-[#0657d0] hover:text-[#0f1f3d] transition-colors duration-200 hover:underline underline-offset-4"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  // ---------- Main Form (Steps 1 & 2) ----------

  return (
    <div className="w-full h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-4">
      <form onSubmit={handleNext} className="w-full max-w-xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0657d0] bg-[#0657d0]/5 px-3 py-1.5 rounded-full border border-[#0657d0]/10">
              Step {step} of 2
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#0657d0] to-[#0f1f3d] rounded-full transition-all duration-500 ease-out"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f1f3d] mb-1.5 leading-tight">
            {step === 1 ? 'Get Started' : 'Tell Us About Your Needs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {step === 1
              ? 'Complete your application and get approved within 24 hours.'
              : 'Help us tailor the best solution for your business.'}
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-3.5 mb-5">
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

              {/* Phone field with fixed +91 prefix and 10-digit input */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-semibold text-[#0f1f3d] ml-0.5">
                  Phone Number<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div
                  className={`flex items-center h-11 sm:h-12 px-3 rounded-xl border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0657d0]/20 focus-within:border-[#0657d0] ${
                    errors.phone
                      ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm sm:text-base font-medium text-slate-500 select-none pr-2 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    data-clarity-unmask="true"
                    className="flex-1 h-full pl-2 pr-1 text-sm sm:text-base text-[#0f1f3d] placeholder:text-slate-400 outline-none border-none"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                {errors.phone && (
                  <span className="text-xs text-red-500 ml-0.5 mt-0.5">
                    {errors.phone}
                  </span>
                )}
              </div>

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
                  {
                    value: 'private_limited',
                    label: 'Private Limited Company',
                  },
                  {
                    value: 'llp',
                    label: 'Limited Liability Partnership (LLP)',
                  },
                  {
                    value: 'sole_proprietorship',
                    label: 'Sole Proprietorship',
                  },
                  { value: 'freelancer', label: 'Freelancer' },
                ]}
              />
            </>
          )}

          {step === 2 && (
            <>
              <CompactSelect
                label="Have you received international payments before?"
                name="internationalPaymentHistory"
                value={formData.internationalPaymentHistory}
                onChange={handleChange}
                error={errors.internationalPaymentHistory}
                placeholder="Select Option"
                required
                options={[
                  { value: 'regular', label: 'Yes, regularly' },
                  { value: 'occasional', label: 'Yes, occasionally' },
                  { value: 'new', label: 'No, but I need to start' },
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
                  { value: 'tier1', label: 'Under $1,000' },
                  { value: 'tier2', label: '$1,000 - $10,000' },
                  { value: 'tier3', label: '$10,000 - $50,000' },
                  { value: 'tier4', label: '$50,000 - $100,000' },
                  { value: 'tier5', label: 'Over $100,000' },
                ]}
              />

              <CompactSelect
                label="When do you need to start receiving payments?"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                error={errors.urgency}
                placeholder="Select Timeframe"
                required
                options={[
                  {
                    value: 'immediate',
                    label: 'Immediately (within 1 week)',
                  },
                  { value: '1_month', label: 'Within 1 month' },
                  { value: '3_months', label: 'Within 3 months' },
                  { value: 'research', label: 'Just researching' },
                ]}
              />
            </>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || (step === 1 && isStep1Submitting)}
          className="w-full h-12 bg-gradient-to-r from-[#0657d0] to-[#0f1f3d] hover:from-[#0f1f3d] hover:to-[#0657d0] text-white font-semibold rounded-xl shadow-lg shadow-[#0657d0]/25 hover:shadow-xl hover:shadow-[#0657d0]/30 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed group focus:outline-none focus:ring-4 focus:ring-[#0657d0]/30 active:scale-[0.98]"
        >
          {isSubmitting || (step === 1 && isStep1Submitting) ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
              <span>{step === 1 ? 'Saving...' : 'Submitting...'}</span>
            </>
          ) : step === 1 ? (
            <>
              <span>Continue</span>
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                strokeWidth={2.5}
              />
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
            </>
          )}
        </button>

        {/* Back Button */}
        {step === 2 && (
          <button
            type="button"
            onClick={handleBack}
            className="w-full mt-3 h-10 text-slate-600 hover:text-[#0657d0] font-medium text-sm transition-colors duration-200"
          >
            ← Back to Step 1
          </button>
        )}

        {/* Privacy Note */}
        <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
          By continuing, you agree to Karbon&apos;s{' '}
          <a 
            href="https://www.karbonfx.com/termsconditions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#0657d0] hover:underline cursor-pointer"
          >
            Terms
          </a>
          {' '}and{' '}
          <a 
            href="https://www.karbonfx.com/privacypolicy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#0657d0] hover:underline cursor-pointer"
          >
            Privacy Policy
          </a>
          .
        </p>

      </form>
    </div>
  );
};
