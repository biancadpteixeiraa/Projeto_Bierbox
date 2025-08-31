import { cn } from "@/app/lib/utils";

export default function Button({
    children,
    variant = 'primary',
    ...props
}:{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>
){
  return (
    <button
        {...props}
        className={cn(`whitespace-nowrap rounded-lg px-6 py-3 text-base`,
            variant === 'primary' && 'bg-yellow-primary text-beige-primary',
            variant === 'secondary' && 'bg-yellow-secondary text-brown-tertiary',
            variant === 'tertiary' && 'bg-beige-primary text-yellow-primary border border-yellow-primary border-4',
            variant === 'quaternary' && 'bg-yellow-secondary text-beige-primary',
            variant === 'quinary' && 'bg-green-primary text-beige-primary',
            variant === 'senary' && 'bg-beige-primary text-yellow-secondary border border-yellow-secondary',
            props.className
        )}
    >
      {children}
    </button>
  );
}