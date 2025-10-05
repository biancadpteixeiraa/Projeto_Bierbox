import { cn } from "@/app/lib/utils";

export default function Input({
    variant = 'primary',
    ...props
}:{
    variant?: 'primary' | 'secondary';
} & React.InputHTMLAttributes<HTMLInputElement>
) {
    return (
        <input
            {...props}
            className={cn(`text-xs sm:text-sm w-full p-3 bg-transparent`,
                 variant === 'primary' && 'text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35',
                 variant === 'secondary' && 'text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary',
                props.className
            )}
        />
    );
}