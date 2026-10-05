/**
 * Join class names, skipping falsy values. Nested arrays are flattened.
 * cn('a', cond && 'b', ['c', null]) -> 'a b c'
 *
 * No tailwind-merge: components put caller `className` LAST and avoid
 * conflicting utilities internally, so overrides stay predictable.
 */
export type ClassValue = string | number | false | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };
  inputs.forEach(walk);
  return out.join(' ');
}
