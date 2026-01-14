export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    // Keep Unicode letters (including Chinese), numbers, dashes, underscores
    // \p{L} matches any unicode letter
    // \p{N} matches any unicode number
    .replace(/[^\p{L}\p{N}\-_]+/gu, "") 
    .replace(/--+/g, "-"); // Replace multiple - with single -
}
