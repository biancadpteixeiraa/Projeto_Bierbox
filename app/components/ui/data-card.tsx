import { cn } from "@/app/lib/utils";


export default function DataCard({
      children,
    ...props
    }: {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
        {...props}
        className={cn(`min-w-60
            shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)] rounded-2xl px-5 py-8 bg-beige-primary 
            flex flex-col justify-center border border-gray-primary`,
            props.className
        )}
    >
      {children}
    </div>
  );
}