export function getPostHref(slug: string) {
  return `/posts/${encodeURIComponent(slug)}`;
}

export function decodeRouteSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
