import slugify from 'slugify';

const SOURCE_BRAND_PATTERNS: RegExp[] = [
  /\b(?:https?:\/\/)?(?:www\.)?xvideosbuceta\.com\b/gi,
  /\bxvideos[\s-]*buceta\b/gi,
];

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function removeSourceBrandTerms(value: string): string {
  let sanitized = value;

  for (const pattern of SOURCE_BRAND_PATTERNS) {
    sanitized = sanitized.replace(pattern, ' ');
  }

  return collapseWhitespace(sanitized);
}

export function sanitizeImportedTitleForSlug(rawValue: string): string {
  const normalized = collapseWhitespace(rawValue || '');
  if (!normalized) return '';

  const withoutSourceBrand = removeSourceBrandTerms(normalized)
    .replace(/[-|:\s]+$/g, '')
    .trim();

  return collapseWhitespace(withoutSourceBrand);
}

export function buildVideoSlugBase(rawValue: string): string {
  const sanitized = sanitizeImportedTitleForSlug(rawValue);
  const fallbackValue = sanitized || collapseWhitespace(rawValue || '') || 'video';

  return slugify(fallbackValue, { lower: true, strict: true }) || 'video';
}

export function buildRandomizedVideoSlug(baseSlug: string): string {
  const normalizedBase = slugify(baseSlug, { lower: true, strict: true }) || 'video';
  return `${normalizedBase}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
