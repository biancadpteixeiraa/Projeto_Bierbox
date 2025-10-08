'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { Icon } from "@iconify/react";

export default function NavLinks() {
  const pathname = usePathname();
  const params = useParams();
  const id = params.id as string; 

  const links = [
    { 
      name: 'Visão Geral', 
      href: `/${id}/dashboard`, 
    },
    {
      name: 'Vendas/Pedidos',
      href: `/${id}/dashboard/vendas`,
    },
    {
      name: 'Assinaturas',
      href: `/${id}/dashboard/assinaturas`,
    },
    {
      name: 'Clientes',
      href: `/${id}/dashboard/clientes`,
    },
    {
      name: 'Produtos (Boxes)',
      href: `/${id}/dashboard/produtos`,
    },
  ];

  return (
    <>
      <div className="flex items-end gap-2 pb-4 cursor-default">
        <Icon icon="uil:user" className="text-2xl text-brown-tertiary"/>
        <p className="text-brown-tertiary text-sm font-medium">MINHA CONTA</p>
      </div>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn( 
            'flex h-[48px] grow items-center gap-2 rounded-l-[10px] text-brown-tertiary text-sm font-semibold hover:underline md:flex-none md:justify-start',
            {
              'text-brown-tertiary underline': pathname === link.href,
            },
          )}
        >
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );
}
