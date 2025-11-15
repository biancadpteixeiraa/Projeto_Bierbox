'use client';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import {useState } from 'react';
import NavLinks from './nav-links';
import Button from "../../../ui/button";
import Link from "next/link";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { useParams } from 'next/navigation';


export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logoutAdmin } = useAdminAuth();
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center md:py-4 py-0 bg-beige-primary">
      <button
        className="absolute right-4 top-6 z-40 block md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <XMarkIcon className="h-8 w-8 text-brown-tertiary" /> : <Bars3Icon className="h-8 w-8 text-brown-tertiary" />}
      </button>

      <div
        className={`flex grow w-full sm:max-w-xs flex-col justify-between md:pt-0 fixed inset-y-0 right-0 z-30 w-64 bg-beige-primary border-l 
          border-brown-tertiary md:border-r  md:bg-beige-primary pt-18 transition-transform duration-300 ease-in-out md:rounded-none rounded-l-2xl
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}
      >
        <button className='pt-6' onClick={() => setMenuOpen(false)}>
        <Link href={`/admin/${id}/dashboard`}>
              <div className="flex items-center justify-center gap-5 px-12 w-full">
                  <img src="/logo.png" alt="Logo da Bierbox" className="size-20"/>
              </div>
          </Link>
          <div className="flex flex-col justify-center md:items-start items-end pt-12 md:pl-16 md:pr-0 pr-24 md:w-full">
            <NavLinks/>
          </div>
        </button >
        
        <div className='flex flex-col items-center justify-center md:mb-8 mb-6 px-10'>
            <Button onClick={logoutAdmin} className='w-full py-3 uppercase font-medium' variant='primary'>Sair</Button>
        </div>
      </div>
      
    </div>
  );
}