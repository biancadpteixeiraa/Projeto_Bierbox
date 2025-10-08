'use client';
import { Icon } from "@iconify/react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import NavLinks from './nav-links';
import Button from "../../ui/button";
import { useAuth } from '@/app/context/authContext';
import Link from "next/link";


export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center md:py-4 py-0 bg-beige-secondary">
      <button
        className="absolute right-4 top-6 z-40 block md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <XMarkIcon className="h-8 w-8 text-brown-tertiary" /> : <Bars3Icon className="h-8 w-8 text-brown-tertiary" />}
      </button>

      <div
        className={`flex grow w-full sm:max-w-sm flex-col justify-between px-4 md:px-2 md:pt-0 fixed inset-y-0 right-0 z-30 w-64 bg-beige-primary border-l 
          border-brown-tertiary md:border-none  md:bg-beige-secondary pt-18 transition-transform duration-300 ease-in-out md:rounded-none rounded-l-2xl
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}
      >
        <button className='pt-6' onClick={() => setMenuOpen(false)}>
        <Link href="/">
              <div className="flex items-center gap-5 px-12">
                  <Icon icon="solar:arrow-left-outline" className="text-3xl text-yellow-secondary"/>
                  <p className="text-base font-secondary text-yellow-secondary font-semibold">
                      Voltar ao início
                  </p>
              </div>
          </Link>
          <div className="flex flex-col justify-center items-start pt-12 px-16 w-full">
            <NavLinks/>
          </div>
        </button >
        
        <div className='flex flex-col items-center justify-center md:mb-8 mb-6 px-10'>
            <Button onClick={logout} className='w-full py-3 uppercase font-medium' variant='quaternary'>Sair</Button>
        </div>
      </div>
      
    </div>
  );
}