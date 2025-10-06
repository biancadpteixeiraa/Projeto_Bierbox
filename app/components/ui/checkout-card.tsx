import { cn } from "@/app/lib/utils";


export default function CheckoutCard({
      children,
    ...props
    }: {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
        {...props}
        className={cn(` 
            shadow-none lg:shadow-[2px_12px_44px_2px_rgb(00,00,00,0.1)] rounded-lg px-6 py-8 bg-beige-primary 
            flex flex-col text-center justify-center`,
            props.className
        )}
    >
      {children}
    </div>
  );
}