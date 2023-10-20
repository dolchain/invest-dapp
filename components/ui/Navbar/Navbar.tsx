import Link from 'next/link';
import { createServerSupabaseClient } from '@/app/supabase-server';

import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';
import ResponsiveNavbar from './ResponsiveNavbar';
// import { getUserDetail } from '@/utils/supabase-admin';

import s from './Navbar.module.css';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  // const [userDetail] = user ? await Promise.all([getUserDetail(user.id)]) : [];

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <ResponsiveNavbar user={user} role={
          // userDetail?.role
          'role'
        } />
      </div>
    </nav>
  );
}
