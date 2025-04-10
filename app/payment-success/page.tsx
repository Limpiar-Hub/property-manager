'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from "@/hooks/useReduxHooks";


const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAppSelector((state) => state.auth);


  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) return;

    const verifyPayment = async () => {
      try {
        // Using the correct URL
        const res = await fetch(`https://limpiar-backend.onrender.com/api/payments/success/${session_id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Set the Bearer token
            },
          });;

        if (!res.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await res.json();
        console.log('Payment verification response:', data);

        if (data.success === true) {
          // Redirect to the transactions page if payment was successful
          router.push('/payment');
        } else {
          // Redirect to a failure page if payment was not successful
          router.push('/payment');
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        router.push('/payment');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return null; // No UI – user will be redirected
};

export default PaymentSuccess;
