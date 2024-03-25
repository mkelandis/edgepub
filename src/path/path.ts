/**
 * PATHS ARE SHARED BY R2 and ITTY-ROUTER
 */

import { MicroformatFolder, MicroformatType } from "../microformats/microformats";

export function getPathPrefix(type: MicroformatType): string {
  return `micropub/${MicroformatFolder[type]}`;
}