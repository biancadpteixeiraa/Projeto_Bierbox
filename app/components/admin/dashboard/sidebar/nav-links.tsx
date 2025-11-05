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
      href: `/admin/${id}/dashboard`, 
      icon: 'material-symbols-light:home-rounded'
    },
    {
      name: 'Vendas/Pedidos',
      href: `/admin/${id}/dashboard/vendas`,
      icon: 'ph:chart-bar-light'
    },
    {
      name: 'Assinaturas',
      href: `/admin/${id}/dashboard/assinaturas`,
      icon: 'material-symbols-light:list-alt-check-outline',
    },
    {
      name: 'Clientes',
      href: `/admin/${id}/dashboard/clientes`,
      icon: 'mdi:user',
    },
    {
      name: 'Produtos (Boxes)',
      href: `/admin/${id}/dashboard/produtos`,
      icon: 'hugeicons:store-add-01',
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn( 
            'w-full flex h-10 px-2 grow items-center mb-3 md:rounded-l-[10px] md:rounded-r-none rounded-r-[10px] text-brown-tertiary text-lg font-semibold hover:bg-[rgb(93,69,25,0.15)] md:flex-none justify-end md:justify-start',
            {
              'text-brown-tertiary bg-[rgb(93,69,25,0.15)]': pathname === link.href,
            },
          )}
        >
          <div className="flex items-end gap-2 py-2 text-brown-tertiary">
            <Icon icon={link.icon} className="text-2xl text-brown-tertiary"/>
            <p>{link.name}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
