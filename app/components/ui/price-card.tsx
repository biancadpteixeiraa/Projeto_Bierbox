import { cn } from "@/app/lib/utils";


export default function PriceCard({
    children,
    label,
    ...props
    }: {
    children: React.ReactNode;
    label?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
        {...props}
        className={cn(`
            shadow-[0px_9px_26px_-10px_rgb(93,69,25,60)] rounded-xl bg-white
            flex flex-col text-start justify-center cursor-pointer`,
            props.className
        )}
    >
        <div className="flex justify-center items-center rounded-t-lg bg-yellow-secondary">
            <span className="uppercase text-[8px] lg:text-xs font-primary p-2">
                {label}
            </span>
        </div>
        <div className="p-4 lg:px-6 lg:py-8">
            {children}
        </div>
    </div>
  );
}