import { cn } from "@/app/lib/utils";

export default function Button({
    children,
    variant = 'primary',
    ...props
}:{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>
){
  return (
    <button
        {...props}
        className={cn(`whitespace-nowrap rounded-lg px-6 py-3 text-base`,
            variant === 'primary' && 'bg-yellow-primary text-beige-primary',
            variant === 'secondary' && 'bg-yellow-secondary text-brown-tertiary',
            variant === 'tertiary' && 'bg-beige-primary text-yellow-primary border border-yellow-primary border-4',
            props.className
        )}
    >
      {children}
    </button>
  );
}