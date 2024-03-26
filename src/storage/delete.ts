import { Env } from "../env";
import { getDeletedPath } from "../path/path";

export async function deleteOne(env: Env, path: string) {
  const deletedPath = getDeletedPath(path);
  console.log(`delete from: ${path} to ${deletedPath}`);

  // move the file into a deleted folder instead of deleting it
  const toDeleteObject = await env.BUCKET.get(path);
  if (toDeleteObject) {
    console.log('toDeleteObject: ', toDeleteObject);
    await env.BUCKET.put(deletedPath, toDeleteObject.body);
    await env.BUCKET.delete(path);
  }
}

export async function restoreOne(env: Env, path: string) {
  const deletedPath = getDeletedPath(path);
  console.log(`restore from: ${deletedPath} to ${path}`);

  // move the file out of the deleted folder to restore it
  const toRestoreObject = await env.BUCKET.get(deletedPath);
  if (toRestoreObject) {
    console.log('toRestoreObject: ', toRestoreObject);
    await env.BUCKET.put(path, toRestoreObject.body);
    await env.BUCKET.delete(deletedPath);
  }
}