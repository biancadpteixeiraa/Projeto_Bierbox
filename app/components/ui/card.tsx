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
            group transition duration-150 ease-in-out hover:scale-110 
            hover:shadow-[0px_10px_30px_-10px_rgb(93,69,25,60)] 
            shadow-[0px_9px_26px_-10px_rgb(93,69,25,60)] rounded-xl px-6 py-8 bg-beige-primary 
            flex flex-col text-center justify-center cursor-pointer`,
            props.className
        )}
    >
      {children}
    </div>
  );
}