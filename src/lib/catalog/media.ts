/** Bump when a product file is replaced so browsers and the image optimizer fetch the new bytes. */
export const PRODUCT_MEDIA_VERSION = "3";

export function productAsset(path: string) {
  return `${path}?v=${PRODUCT_MEDIA_VERSION}`;
}
