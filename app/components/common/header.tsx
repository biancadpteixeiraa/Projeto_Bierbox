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
  const { user, loading } = useAuth();  
  const { carrinho, loading: cartLoading } = useCarrinho(); 

  const pathname = usePathname();

  const linksMenu = [
    { href: '/', label: 'Home' },
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
                <div className="flex w-full md:flex-1 md:justify-start justify-center">
                    <a href="/" className="">
                        <span className="sr-only">BierBox</span>
                        <img 
                        alt=""
                        src="/Logo.png"
                        className="sm:size-20 size-auto"
                        />
                    </a>
                </div>
                <div className="flex flex-1 justify-end gap-10">
                    {loading ? (

                        <div></div>
                    ) : (
                        !user && ( 
                        <div className='hidden md:flex md:items-center gap-2'>
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
                    )}
                    
                    {loading && cartLoading ? (
                        <div className='flex md:hidden items-center w-8 h-10 animate-pulse bg-[#f7ebc1] rounded-md mr-5'></div>
                    ) : (
                        <div className='flex items-center pr-4 md:pr-0'>
                            <button onClick={cartOpen} aria-label="Abrir carrinho de compras">
                            <Icon icon="mdi:refrigerator" className="size-8 text-brown-secondary"/>
                            </button>
                            <span className='flex items-center justify-center text-[10px] bg-brown-tertiary text-beige-primary rounded-full min-w-[15px] h-4 px-1 font-medium -ml-1'>
                            {carrinho?.itens?.length || 0}
                            </span>
                        </div>
                    )}
                    {loading && cartLoading ? (
                        <div className='hidden md:flex items-center w-52 h-10 animate-pulse bg-[#f7ebc1] rounded-md'></div>
                    ) : (
                        user && (
                            <Link href={`/dashboard/${user.id}`} className='hidden md:flex items-center'>
                                <Icon icon="uil:user" className="text-4xl text-brown-secondary"/>
                            </Link>
                        )
                    )}
                </div>
                <div className="flex md:hidden justify-end">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-secondary"
                    >
                        <span className="sr-only">Abrir menu principal</span>
                        <MenuIcon aria-hidden="true" className="size-6" />
                    </button>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-beige-primary sm:max-w-sm sm:ring-1 sm:ring-brown-secondary rounded-l-xl"
                id="mobile-menu"
                aria-modal="true"
                aria-labelledby="menu-title"
                >
                <div id="menu-title" className="sr-only">Menu de Navegação Principal</div> 
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
                        <span className="sr-only">Fechar menu</span>
                        <X aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <hr className=" h-0.25 w-full bg-brown-primary" />
                <div className="mt-6 flow-root px-6 py-4">
                    <div>
                        <div className='flex items-center gap-2 -mx-1'>
                            {user ? (
                        <Link href={`/dashboard/${user.id}`} className='flex items-center gap-2'>
                            <Icon icon="uil:user" className="text-4xl text-brown-secondary"/> 
                            <p>MINHA CONTA</p>
                        </Link>
                    ) : (
                            <>
                                <UserRound className="size-9 text-brown-secondary" />
                                <p className='text-brown-secondary text-lg'>
                                    Olá!
                                    <br />
                                    <span><Link href={'/login'} className='underline font-bold'>Entre</Link> </span>
                                    ou
                                    <span> <Link href={'/cadastro'} className='underline font-bold'>Cadastre-se</Link></span>
                                </p>
                            </>
                        )}
                        </div>
                    </div>
                    <div className="space-y-2 py-8">
                        {linksMenu.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={pathname === link.href ? 'page' : undefined} 
                                className={`block py-2 text-lg text-brown-primary md:mx-8 mx-auto hover:font-semibold ${
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
        <div className='bg-yellow-primary hidden md:block py-1'>
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-center px-5 py-4 md:px-8">
                <PopoverGroup className="hidden md:flex lg:gap-x-16 gap-x-8 text-nowrap">
                 {linksMenu.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm text-beige-primary mx-3 lg:mx-6 mx-auto hover:font-semibold ${
                        pathname === link.href ? 'font-semibold' : ''
                        }`}
                        aria-current={pathname === link.href ? 'page' : undefined} 
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