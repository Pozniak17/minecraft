/** Внутрішній redirect після login/register — лише same-origin шляхи. */
export function safeNextPath(value: string | null | undefined, fallback = '/dashboard'): string {
  if (!value) return fallback;
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  return path;
}
