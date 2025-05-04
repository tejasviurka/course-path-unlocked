
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Add missing cva function for label component
export const cva = (base, variants) => {
  return (options) => {
    const variantClassNames = Object.entries(options || {})
      .reduce((acc, [key, value]) => {
        if (variants?.[key]?.[value]) {
          return [...acc, variants[key][value]];
        }
        return acc;
      }, []);

    return [base, ...variantClassNames].join(' ');
  };
};
