import { cn } from "@/app/lib/utils";


export default function Card({
      children,
    ...props
    }: {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
        {...props}
        className={cn(`
            group transition duration-150 ease-in-out hover:scale-105 
            shadow-[0px_0px_28px_-10px_#5D4519] rounded-lg px-6 py-8 bg-beige-primary 
            flex flex-col text-center max-w-56 cursor-pointer`,
            props.className
        )}
    >
      {children}
    </div>
  );
}