export function formatPersonName(
  firstName?: string | null,
  lastName?: string | null,
  fallback?: string | null,
): string {
  const full = [firstName, lastName]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ');

  if (full) return full;
  return fallback?.trim() || '';
}
