import { Env } from "../env";
import { MicropubUpdate } from "../microformats/microformats";
import { getPathFromUrl } from "../path/path";
import { restoreOne } from "../storage/delete";

export async function postUndelete(env: Env, micropubUpdate: MicropubUpdate) {

  // get the path without the host
  const path = getPathFromUrl(micropubUpdate.url);
  console.log(`undelete path: ${path}`);

  // restore the data in r2 using the same path
  await restoreOne(env, path);

  // return a response
  return new Response(null, {
    status: 204
  });

}
