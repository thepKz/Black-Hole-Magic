/**
 * Shared control styling for Input / Textarea / Select (16px on mobile to avoid iOS zoom).
 * Border / focus ring swap instantly - no paint-heavy colour or box-shadow transitions.
 */
export const controlBase =
  'block w-full rounded-md border border-divider bg-surface text-base text-ink md:text-[15px] placeholder:text-subtle/80 ' +
  'hover:border-neutral-400 focus-visible:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20 ' +
  'aria-invalid:border-danger aria-invalid:focus:ring-danger/15 ' +
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60 read-only:bg-neutral-50';
