import { cn } from "@/app/lib/utils";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cn(`text-xs sm:text-sm w-full p-3 bg-transparent text-gray-tertiary placeholder:text-gray-tertiary/0.6 rounded-xl border border-gray-tertiary/35`,
                props.className
            )}
        />
    );
}