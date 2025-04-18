'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToWaitlist } from '@/lib/waitlist';
import { trackWaitlistSignup } from '@/lib/mixpanel';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const result = await addToWaitlist(email);
      
      if (result.success) {
        // Track successful waitlist signup
        trackWaitlistSignup(email);
        
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to join waitlist. Please try again later.');
      console.error('Error submitting waitlist form:', error);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl p-5 flex flex-col items-center text-center">
        <div className="mb-2">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-lg font-medium mb-1">You&apos;re on the list!</h3>
        <p className="text-muted-foreground text-sm">
          Thanks for joining our waitlist! We&apos;ll notify you when Appily launches.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="rounded-lg overflow-hidden bg-background/80 border shadow-sm backdrop-blur">
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            className="w-full h-10 px-4 bg-transparent border-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            required
            disabled={status === 'loading'}
          />
        </div>

        <Button 
          type="submit" 
          className="h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 text-white font-medium text-sm shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-full transform active:scale-[0.98] transition-transform cursor-pointer"
          disabled={status === 'loading' || !email.includes('@')}
          onClick={() => {
            // Add focus and haptic feedback effect (if supported)
            if (navigator.vibrate && window.innerWidth < 768) {
              navigator.vibrate(50);
            }
          }}
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Joining...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center w-full">Join Waitlist</span>
          )}
        </Button>
      </form>

      {status === 'error' && (
        <div className="mt-2 text-xs flex items-center gap-1.5 text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
} 