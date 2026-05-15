export function normalizeSourceUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hash = "";

    for (const param of [...parsedUrl.searchParams.keys()]) {
      if (param.toLowerCase().startsWith("utm_")) {
        parsedUrl.searchParams.delete(param);
      }
    }

    if (parsedUrl.pathname !== "/") {
      parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");
    }

    return parsedUrl.toString();
  } catch {
    return url.trim();
  }
}
