import type { Metadata } from "next";
import { SITE } from "./consts";

/**
 * Creates dynamic metadata
 * @param path - page path (e.g., '/', '/about', '/')
 * @param pageTitle - optional page-specific title
 * @param description - optional page description
 * @returns metadata object
 */
export function createMetadata(path: string, pageTitle?: string, description?: string): Metadata {
  const title = pageTitle ? `${pageTitle} | ${SITE.name}` : `${SITE.name} | ${SITE.description}`;

  return {
    title,
    description: description || SITE.description,
    alternates: {
      canonical: `${SITE.url}${path}`,
    },
  };
}
