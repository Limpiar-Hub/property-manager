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
      const {data, error} = await verifyStripePayment({session_id});
      if ((data as { success: boolean }).success === true) {
        router.push('/payment');
      } else {
        router.push('/payment');
      }

      if (error) {
        router.push('/payment');
      }
    }
      
    verifyPayment();
  }, [searchParams, router]);

  return null; // No UI – user will be redirected
};

export default PaymentSuccess;
