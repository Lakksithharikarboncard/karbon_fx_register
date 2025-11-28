// utils/airtable.ts

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_ID = 'tblW69KuZCiBzEA1R'; // Your table ID

interface AirtableRecord {
  name?: string;
  phone_number?: string;
  email?: string;
  business_type?: string;
  previous_experience?: string;
  monthly_volume?: string;
  start_receiving_at?: string;
  source?: string;
  keyword?: string;
  ip_address?: string;
  referrer?: string;
  user_agent?: string;
  timestamp?: string;
}

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// Extract UTM parameters from URL
export const getUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
  };
};

// Get referrer source - reads from URL param first (for iframe), then falls back to document.referrer
export const getReferrerSource = (): string => {
  if (typeof window === 'undefined') return 'direct';
  
  // First, check if referrer was passed as URL parameter (from parent page)
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');
  
  if (refParam) {
    return refParam; // Use the referrer passed from parent page
  }
  
  // Fallback to document.referrer
  const referrer = document.referrer;
  
  if (!referrer) return 'direct';
  
  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname;
    
    // Map common referrers
    if (hostname.includes('google')) return 'google';
    if (hostname.includes('facebook')) return 'facebook';
    if (hostname.includes('linkedin')) return 'linkedin';
    if (hostname.includes('twitter') || hostname.includes('t.co')) return 'twitter';
    if (hostname.includes('instagram')) return 'instagram';
    if (hostname.includes('youtube')) return 'youtube';
    
    return hostname;
  } catch {
    return 'unknown';
  }
};

// Extract search keywords - reads from URL param first (for iframe), then falls back to referrer extraction
export const getSearchKeyword = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  // First, check if keyword was passed as URL parameter (from parent page)
  const urlParams = new URLSearchParams(window.location.search);
  const keywordParam = urlParams.get('keyword');
  
  if (keywordParam) {
    return keywordParam; // Use the keyword passed from parent page
  }
  
  // Fallback to extracting from document.referrer
  const referrer = document.referrer;
  
  if (!referrer) return undefined;
  
  try {
    const referrerUrl = new URL(referrer);
    
    // Google search
    if (referrerUrl.hostname.includes('google')) {
      const query = referrerUrl.searchParams.get('q');
      if (query) return query;
    }
    
    // Bing search
    if (referrerUrl.hostname.includes('bing')) {
      const query = referrerUrl.searchParams.get('q');
      if (query) return query;
    }
    
    // Yahoo search
    if (referrerUrl.hostname.includes('yahoo')) {
      const query = referrerUrl.searchParams.get('p');
      if (query) return query;
    }
    
    return undefined;
  } catch {
    return undefined;
  }
};

// Build source string with UTM data
export const buildSourceString = (): string => {
  const utmParams = getUTMParams();
  const referrerSource = getReferrerSource();
  
  // Priority: UTM source > referrer > direct
  const primarySource = utmParams.utm_source || referrerSource;
  
  // Build detailed source string
  const sourceParts = [primarySource];
  
  if (utmParams.utm_medium) sourceParts.push(utmParams.utm_medium);
  if (utmParams.utm_campaign) sourceParts.push(utmParams.utm_campaign);
  
  return sourceParts.join(' / ');
};

// Fetch user's IP address
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.error('Failed to fetch IP:', error);
    return 'unknown';
  }
};

// Get full referrer URL (for detailed tracking)
export const getFullReferrer = (): string => {
  if (typeof window === 'undefined') return 'none';
  
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');
  
  if (refParam) {
    return refParam;
  }
  
  return document.referrer || 'direct';
};

// Get user agent (device/browser info)
export const getUserAgent = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  return navigator.userAgent || 'unknown';
};

// Get timestamp in ISO format
export const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Create or update Airtable record
export const upsertAirtableRecord = async (
  data: AirtableRecord,
  recordId?: string
): Promise<{ success: boolean; recordId?: string; error?: string }> => {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Airtable credentials missing');
    return { success: false, error: 'Configuration error' };
  }

  const url = recordId
    ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}/${recordId}`
    : `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;

  const method = recordId ? 'PATCH' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', errorData);
      return { success: false, error: errorData.error?.message || 'API error' };
    }

    const result = await response.json();
    return { success: true, recordId: result.id };
  } catch (error) {
    console.error('Airtable request failed:', error);
    return { success: false, error: 'Network error' };
  }
};
