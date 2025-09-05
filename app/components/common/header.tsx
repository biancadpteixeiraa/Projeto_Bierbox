'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import { UserRound, X, MenuIcon } from 'lucide-react'
import { Icon } from "@iconify/react";
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import ShoppingCart from './shopping-cart';
import { useAuth } from '@/app/context/authContext';
import { useCarrinho } from '@/app/context/cartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shoppingCartOpen, setShoppingCartOpen] = useState(false)
  const isAuthenticated = useAuth();   
  const { carrinho} = useCarrinho();

  const pathname = usePathname();

  const linksMenu = [
    { href: '/planos', label: 'Planos de Assinatura' },
    { href: '/descubra', label: 'Descubra sua Box' },
    { href: '/rota-da-cerveja', label: 'Rota da Cerveja' },
    { href: '/quem-somos', label: 'Quem Somos' },
  ]

const cartOpen = () => {
    setShoppingCartOpen(true);
  };

  const cartClose = () => {
    setShoppingCartOpen(false);
  };


  return (
    <header className="bg-white flex flex-col font-secondary">
        <div className='bg-beige-primary py-1 px-10'>
            <nav aria-label="Global" className="mx-auto flex max-w-6xl items-center">
                <div className="flex w-full lg:flex-1 lg:justify-start justify-center">
                    <a href="/" className="">
                        <span className="sr-only">BierBox</span>
                        <img 
                        alt=""
                        src="/Logo.png"
                        className="sm:size-20 size-auto"
                        />
                    </a>
                </div>
                <div className="flex flex-1 justify-end gap-20">
                    {isAuthenticated?.user ? (
                        <Link href={`/dashboard/${isAuthenticated.user.id}`}>
                        <Icon icon="mdi:gear" className="text-4xl text-brown-secondary"/>
                        </Link>
                    ) : (
                        <div className='hidden lg:flex lg:items-center gap-2'>
                        <UserRound className="size-6 text-brown-secondary" />
                        <p className='text-brown-secondary text-xs font-medium'>
                            Olá!
                            <br />
                            <span><Link href={'/login'} className='underline font-bold'>Entre</Link> </span>
                            ou
                            <span> <Link href={'/cadastro'} className='underline font-bold'>Cadastre-se</Link></span>
                        </p>
                    </div>
                        )
                    }
                    <div className='flex items-center pr-4 lg:pr-0'>
                        <button onClick={cartOpen}>
                            <Icon icon="mdi:refrigerator" className="size-8 text-brown-secondary"/>
                        </button>
                        <span className='flex items-center justify-center text-[10px] bg-brown-tertiary text-beige-primary rounded-full min-w-[15px] h-4 px-1 font-medium -ml-1'>
                            {carrinho?.itens?.length || 0}
                        </span>
                    </div>
                </div>
                <div className="flex lg:hidden justify-end">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-secondary"
                    >
                        <span className="sr-only">Menu</span>
                        <MenuIcon aria-hidden="true" className="size-6" />
                    </button>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-beige-primary sm:max-w-sm sm:ring-1 sm:ring-brown-secondary rounded-l-xl">
                <div className="flex items-center justify-between px-6 py-4">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">BierBox</span>
                        <img 
                        alt=""
                        src="/Logo.png"
                        className="size-20"
                        />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-secondary"
                        >
                        <span className="sr-only">Close menu</span>
                        <X aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <hr className=" h-0.25 w-full bg-brown-primary" />
                <div className="mt-6 flow-root px-6 py-4">
                    <div className="">
                        
                        <div className='flex items-center gap-2 -mx-1'>
                            <UserRound className="size-9 text-brown-secondary" />
                            <p className='text-brown-secondary text-lg'>
                                Olá!
                                <br />
                                <span><Link href={'/login'} className='underline font-bold'>Entre</Link> </span>
                                ou
                                <span> <Link href={'/cadastro'} className='underline font-bold'>Cadastre-se</Link></span>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 py-8">
                        {linksMenu.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block py-2 text-lg text-brown-primary lg:mx-8 mx-auto hover:font-semibold ${
                                pathname === link.href ? 'font-semibold underline' : ''
                                }`}
                                >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                </DialogPanel>
            </Dialog>
        </div>
        <div className='bg-yellow-primary hidden lg:block py-1'>
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-center px-5 py-4 lg:px-8">
                <PopoverGroup className="hidden lg:flex lg:gap-x-20">
                 {linksMenu.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm text-beige-primary lg:mx-9 mx-auto hover:font-semibold ${
                        pathname === link.href ? 'font-semibold' : ''
                        }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </PopoverGroup>
            </nav>
        </div>
        <ShoppingCart isOpen={shoppingCartOpen} onClose={cartClose}/>
    </header>
  )
}