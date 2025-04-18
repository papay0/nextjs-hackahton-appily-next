'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initMixpanel, trackPageView } from '@/lib/mixpanel';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Mixpanel once
    initMixpanel();
  }, []);

  useEffect(() => {
    // Track page views when the pathname changes
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
} 