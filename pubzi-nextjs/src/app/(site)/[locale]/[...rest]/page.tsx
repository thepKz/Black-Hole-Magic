import { notFound } from 'next/navigation';

/** Any unknown path under /{locale}/... renders the localized not-found.tsx. */
export default function CatchAll(): never {
  notFound();
}
