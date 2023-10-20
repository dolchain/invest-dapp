"use client";

import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';
import { useEffect, useState } from 'react';
import s from './Navbar.module.css';
import { AiOutlineMenu } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

interface Props {
  user: any;
  // role: string | null | undefined;
}

export default async function ResponsiveNavbar({ user,
  // role 
}: Props) {
  const [navbar, setNavbar] = useState(false);
  const menu = [
    { name: "Account", url: "/account" },
    { name: "Transaction", url: "/transaction" },
  ];

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>

        <nav className="hidden ml-6 space-x-2 sm:block">
          {user && (
            <>
              <Link href="/account" className={s.link}>
                Account
              </Link>
              <Link href="/transaction" className={s.link}>
                Transaction
              </Link>
              {/* {
                role == 'admin' && (
                  <Link href="/admin" className={s.link}>
                    Admin-Dashboard
                  </Link>
                )
              } */}
            </>
          )}
        </nav>
      </div>
      <div className="flex justify-end flex-1 space-x-8">
        {user ? (
          <>
            <SignOutButton />
            {user && (
              <div
                className={`bg-black absolute flex-1 justify-self-center mt-10 mr-20 sm:hidden ${navbar ? "block" : "hidden"
                  }`}
                onClick={() => setNavbar(false)}
              >
                <ul className="items-center justify-center space-y-2">
                  {menu.map(({ name, url }, index) => (
                    <li key={index} className="text-white">
                      <Link href={url}>{name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
            }
            <div className="sm:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => {
                  console.log("nav", navbar);
                  setNavbar(!navbar)
                }}
              >
                {navbar ? (
                  <RxCross1 className="text-white" />
                ) : (
                  <AiOutlineMenu className="text-white" />
                )}
              </button>
            </div></>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}