

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyStripePayment } from '@/components/handlers';

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isClient, setIsClient] = useState(false);

  // Ensure the code runs only on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Trigger payment verification only after component mounts on client-side
  useEffect(() => {
    if (!isClient) return; // Don't execute if it's SSR (on the server)

    const session_id = searchParams.get("session_id");
    if (!session_id) return;

    const verifyPayment = async () => {
      try {
        const { data, error } = await verifyStripePayment({ session_id }) as { data: { success: boolean }, error: string };

        if (data.success) {
          router.push('/payment');
        } else {
          console.error("Payment verification failed:", error || "Unknown error");
          router.push('/payment');
        }
      } catch (err) {
        console.error("Unexpected error during payment verification:", err);
        router.push('/payment');
      }
    };

    verifyPayment();
  }, [searchParams, router, isClient]); // Runs only after the component has mounted

  return null; // No UI – user will be redirected
};

export default PaymentSuccess;
