import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (typeof window === 'undefined') return; // Skip during SSR
  
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is missing! Check your .env file.');
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, { debug: process.env.NODE_ENV !== 'production' });
};

// Track page view
export const trackPageView = (pageName: string) => {
  if (typeof window === 'undefined') return;
  
  mixpanel.track('Page View', {
    page: pageName,
    url: window.location.href,
  });
};

// Track waitlist signup
export const trackWaitlistSignup = (email: string) => {
  if (typeof window === 'undefined') return;
  
  mixpanel.track('Waitlist Signup', {
    email: email,
    timestamp: new Date().toISOString(),
  });
  
  // Identify the user for future tracking
  mixpanel.identify(email);
  mixpanel.people.set({
    '$email': email,
    'Signed Up': new Date().toISOString(),
    'Source': 'Waitlist',
  });
}; 