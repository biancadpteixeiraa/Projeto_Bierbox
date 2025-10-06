import { cn } from "@/app/lib/utils";

export default function Button({
    children,
    variant = 'primary',
    ...props
}:{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary' | "septenary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>
){
  return (
    <button
        {...props}
        className={cn(`whitespace-nowrap rounded-lg px-6 py-3 text-base cursor-pointer disabled:cursor-not-allowed`,
            variant === 'primary' && 'bg-yellow-primary text-beige-primary hover:bg-yellow-hover disabled:bg-yellow-disabled',
            variant === 'secondary' && 'bg-yellow-secondary text-brown-tertiary hover:bg-yellow-secondary-hover disabled:bg-yellow-secondary-disabled',
            variant === 'tertiary' && 'bg-beige-primary text-yellow-primary border border-yellow-primary border-4 hover:bg-beige-hover disabled:bg-beige-disabled',
            variant === 'quaternary' && 'bg-yellow-secondary text-beige-primary hover:bg-yellow-secondary-hover disabled:bg-yellow-secondary-disabled',
            variant === 'quinary' && 'bg-green-primary text-beige-primary hover:bg-green-hover disabled:bg-green-disabled',
            variant === 'senary' && 'bg-beige-primary text-yellow-secondary border border-yellow-secondary hover:bg-beige-hover disabled:bg-beige-disabled',
            variant === 'septenary' && 'bg-beige-primary border border-brown-tertiary text-brown-tertiary hover:bg-beige-hover disabled:bg-beige-disabled',
            props.className
        )}
    >
      {children}
    </button>
  );
}