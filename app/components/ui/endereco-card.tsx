import { cn } from "@/app/lib/utils";


export default function EnderecoCard({
      children,
    ...props
    }: {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
        {...props}
        className={cn(` 
            shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)] rounded-lg px-6 py-8 bg-beige-primary 
            flex flex-col text-center justify-center`,
            props.className
        )}
    >
      {children}
    </div>
  );
}