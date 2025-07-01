'use client';

import { useEffect, useState } from "react";
import PaymentForm from "@/app/components/PaymentForm";
import { useRouter, useParams } from "next/navigation";

export default function PaymentEditPage() {
  const router = useRouter();
  const params = useParams();
  const [accountId, setAccountId] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/payments/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setAccountId(data.id))
      .catch(err => console.log(err.message));
  }, []);

  return (
    <PaymentForm
      accountId={String(accountId)}
      paymentId={String(params.id)}
      onSuccess={() => {
        router.push("/payments")
      }}
    />
  );
}
