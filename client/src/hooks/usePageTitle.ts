import { useEffect } from "react";

const BASE_TITLE = "A1 Homestead Hub";

/**
 * Sets document.title for the current page.
 * Appends the base site name automatically.
 *
 * Usage:
 *   usePageTitle("The Schoolhouse");
 *   // → "The Schoolhouse — A1 Homestead Hub"
 *
 *   usePageTitle(); // resets to base title
 */
export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} — ${BASE_TITLE}`
      : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
}
