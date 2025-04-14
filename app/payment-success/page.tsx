
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyStripePayment } from '@/components/handlers';

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
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
  }, [searchParams, router]);

  return null; // No UI – user will be redirected
};

export default PaymentSuccess;