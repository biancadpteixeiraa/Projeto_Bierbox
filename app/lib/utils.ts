import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function paginate<T>(items: T[], currentPage: number, perPage: number): T[] {
  const start = (currentPage - 1) * perPage;
  return items.slice(start, start + perPage);
}
