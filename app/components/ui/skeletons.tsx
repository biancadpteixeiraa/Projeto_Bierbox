// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm w-56 h-72`}
    >
      <div className="flex p-4">
        <div className="h-6 w-full rounded-md bg-[#f7ebc1]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-white px-4 py-8 h-36">
        <div className="h-7 w-20 rounded-md bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function PlansCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm w-96 h-36`}
    >
      <div className="flex p-4">
        <div className="h-6 w-full rounded-md bg-[#f7ebc1]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-white px-4 py-4">
        <div className="h-5 w-20 rounded-md bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

export function PlansCardsSkeleton() {
  return (
    <>
      <PlansCardSkeleton />
      <PlansCardSkeleton />
      <PlansCardSkeleton />
      <PlansCardSkeleton />
    </>
  );
}