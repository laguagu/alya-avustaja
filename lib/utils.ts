import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function pause(ms: number) {
  console.log("pause", ms);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
