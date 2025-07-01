'use client';

import AccountForm from "@/app/components/AccountForm";
import { useRouter, useParams } from "next/navigation";

export default function AccountEditPage() {
  const router = useRouter();
  const params = useParams();

  return (
    <AccountForm
      accountId={String(params.id)}
      onSuccess={() => router.push("/accounts")}
    />
  );
}