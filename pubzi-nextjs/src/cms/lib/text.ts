/**
 * Vietnamese-aware text helpers (no dependencies, safe on server and client).
 */

/** Remove Vietnamese diacritics and lowercase: "Kiếm Thế" -> "kiem the". */
export function foldText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** URL-friendly slug: "Võ Lâm Truyền Kỳ 2" -> "vo-lam-truyen-ky-2". */
export function slugify(input: string | null | undefined): string {
  return foldText(input)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}
