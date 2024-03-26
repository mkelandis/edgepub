import { Env } from "../env";

export async function updateOne(env: Env, path: string, micropubJsonString: string) {
  console.log(`updateOne: ${micropubJsonString}`, {path, env});
  await env.BUCKET.put(path, micropubJsonString);
}