import { Env } from "../env";
import { MicropubUpdate } from "../microformats/microformats";
import { getPathFromUrl } from "../path/path";
import { deleteOne } from "../storage/delete";

export async function postDelete(env: Env, micropubUpdate: MicropubUpdate) {

  // get the path without the host
  const path = getPathFromUrl(micropubUpdate.url);
  console.log(`delete path: ${path}`);

  // delete the data in r2 using the same path
  await deleteOne(env, path);

  // return a response
  return new Response(null, {
    status: 204
  });

}
