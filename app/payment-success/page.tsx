'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyStripePayment } from '@/components/handlers';
import { useAppSelector } from "@/hooks/useReduxHooks";
import { Suspense } from 'react';

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessInner />
    </Suspense>
  );
};

const PaymentSuccessInner = () => {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) return;

    const verifyPayment = async () => {
      try {
        const { data, error } = await verifyStripePayment({ session_id, token }) as { data: { success: boolean }, error: string };

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
  }, [searchParams, router, token]);

  return null; // No UI – user will be redirected
};

export default PaymentSuccessPage;