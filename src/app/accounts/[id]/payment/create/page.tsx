'use client';

import PaymentForm from "@/app/components/PaymentForm";
import { useRouter, useParams } from "next/navigation";

export default function PaymentCreatePage() {
  const router = useRouter();
  const params = useParams();

  return (
    <PaymentForm
      accountId={String(params.id)}
      onSuccess={() => {
        router.push("/payments")
      }}
    />
  );
}
