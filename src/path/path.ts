/**
 * PATHS ARE SHARED BY R2 and ITTY-ROUTER
 */

import { MicroformatFolder, MicroformatType } from "../microformats/microformats";

export function getPathPrefix(type: MicroformatType): string {
  return `micropub/${MicroformatFolder[type]}`;
}

export function getPathFromUrl(url: string): string {
  return new URL(url).pathname.substring(1);
}

export function getDeletedPath(path: string): string {
  return path.replace('micropub/', 'micropub/deleted/');
}

export function getUndeletedPath(path: string): string {
  return path.replace('micropub/deleted/', 'micropub/');
}