'use client';

import AccountForm from "@/app/components/AccountForm";
import { useRouter } from "next/navigation";

export default function AccountCreatePage() {
  const router = useRouter();

  return <AccountForm onSuccess={() => router.push("/accounts")} />;
}
