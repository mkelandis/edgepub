import { Env } from "../env";

export async function createOne(env: Env, path: string, micropubJsonString: string): Promise<void> {
  await env.BUCKET.put(path, micropubJsonString);
}

export async function createOneFile(env: Env, path: string, file: File) {

  const multipartUpload = await env.BUCKET.createMultipartUpload(path);
  
  // log the file stream as a string without consuming it
  // const reader = file.stream().getReader();
  // const { value, done } = await reader.read();
  // console.log('file stream:', new TextDecoder().decode(value));

  const part = await multipartUpload.uploadPart(1, file.stream()) as any;   
  await multipartUpload.complete([part])
}

export async function updateOne(env: Env, path: string, micropubJsonString: string) {
  console.log(`updateOne: ${micropubJsonString}`, {path, env});
  await env.BUCKET.put(path, micropubJsonString);
}