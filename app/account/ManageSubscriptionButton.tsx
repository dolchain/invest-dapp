'use client';

import Button from '@/components/ui/Button';

import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  session: Session;
}

export default function ManageSubscriptionButton({ session }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
      <Button
        variant="slim"
        disabled={!session}
      >
        Open customer portal
      </Button>
    </div>
  );
}
