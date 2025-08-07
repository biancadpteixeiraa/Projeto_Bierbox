'use client';

import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavLinks from './nav-links';
import Button from '../ui/button';


export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();


  return (
    <div className="flex h-full w-full flex-col items-center justify-center md:py-4 py-1 bg-beige-secondary">
      <button
        className="absolute left-4 top-6 z-50 block md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <XMarkIcon className="h-11 w-11 text-white" /> : <Bars3Icon className="h-11 w-11 text-white" />}
      </button>

      <div
        className={`flex grow flex-col justify-between  md:space-x-2 md:pt-0 fixed inset-y-0 left-0 z-40 w-64 bg-main-blue ps-4 pt-18 transition-transform duration-300 ease-in-out 
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        <button className='m-0' onClick={() => setMenuOpen(false)}><NavLinks/></button >
        
        <form className='flex flex-col items-center justify-center md:mb-4 mb-6'>
            <Button className='w-full' variant='quaternary'>Sair</Button>
        </form>
      </div>
      
    </div>
  );
}