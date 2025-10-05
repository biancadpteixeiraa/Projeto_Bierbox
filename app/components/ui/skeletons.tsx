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
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm w-56 md:w-60 h-36`}
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

export function CarouselSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden flex flex-col items-center justify-center lg:flex-row gap-6 lg:gap-10 xl:gap-14 w-full`}
    >
      <div className="flex-shrink-0 w-full max-w-sm lg:max-w-none lg:w-auto">
        <div className="size-96 mx-auto lg:mx-0 rounded-lg bg-[#f7ebc1]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full lg:w-auto justify-center lg:justify-start">
        <div className="w-full sm:w-auto sm:min-w-[280px] rounded-xl bg-[#faf6e6] p-6 shadow-md">
          <div className="h-6 w-32 bg-[#f7ebc1] rounded-md mb-4" />
          <div className="h-10 w-24 bg-[#f7ebc1] rounded-md mb-6" />
          <div className="h-10 w-full bg-white rounded-md" />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[280px] rounded-xl bg-[#faf6e6] p-6 shadow-md">
          <div className="h-6 w-32 bg-[#f7ebc1] rounded-md mb-4" />
          <div className="h-10 w-24 bg-[#f7ebc1] rounded-md mb-6" />
          <div className="h-10 w-full bg-white rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function PlansCarouselSkeleton(){
  return (
    <>
      <CarouselSkeleton />
    </>
  );
}

export function InstagramPhotoSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm size-auto md:size-52 min-h-52`}
    >
      <div className="flex p-4">
        <div className="h-6 w-full rounded-md bg-[#f7ebc1]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-white px-4 py-4 h-28 md:h-4/6">
        <div className="h-5 w-20 rounded-md bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

export function InstagramPhotosSkeleton() {
  return (
    <>
      <div className="flex max-w-5xl justify-between w-full flex-col md:flex-row gap-6 pr-14 lg:p-0">
        <InstagramPhotoSkeleton />
        <InstagramPhotoSkeleton />
        <InstagramPhotoSkeleton />
        <InstagramPhotoSkeleton />
      </div>
    </>
  );
}