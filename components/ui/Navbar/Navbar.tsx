import Link from 'next/link';
import { createServerSupabaseClient } from '@/app/supabase-server';

import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';
import ResponsiveNavbar from './ResponsiveNavbar';

import s from './Navbar.module.css';
import { getRoleFromId } from '@/app/supabase-server';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const [role] = user ? await Promise.all([getRoleFromId()]) : [];

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <ResponsiveNavbar user={user} role={role} />
      </div>
    </nav>
  );
}
