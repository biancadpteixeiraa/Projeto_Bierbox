'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';

const links = [
    { 
    name: 'Informações Pessoais', 
    href: '/dashboard/id', 
    },
    {
    name: 'Planos de Assinatura',
    href: '/dashboard/id/assinaturas',
    
    },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn( 
              'flex h-[48px] grow items-center gap-2 rounded-l-[10px] text-brown-tertiary text-base font-medium hover:bg-second-blue/10 md:flex-none md:justify-start',
              {
                'text-brown-tertiary': pathname === link.href,
              },
            )}
            >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
