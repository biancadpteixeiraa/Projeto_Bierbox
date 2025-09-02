import "./globals.css";
import {Dela_Gothic_One} from "next/font/google";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "../context/authContext";
import { CarrinhoProvider } from "../context/cartContext";


const delaGothic = Dela_Gothic_One({
  subsets: ['latin'],
  weight: '400',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className='antialiased bg-beige-primary text-brown-secodary'>
        <AuthProvider>
          <CarrinhoProvider>
            {children}
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
