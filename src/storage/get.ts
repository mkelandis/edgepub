import { Env } from "../env";
import { MicroformatType, MicropubJson } from "../microformats/microformats";
import { getPathPrefix } from "../path/path";

export async function getMany(microformatsType: MicroformatType, env: Env): Promise<string[]> {
  console.log('getMany: ', {microformatsType, env});
  const prefix = getPathPrefix(microformatsType);
  console.log('prefix: ', prefix); 
  const r2Objects = await env.BUCKET.list({
    prefix
  });

  console.log('r2Objects: ', r2Objects);
  return r2Objects.objects.map((r2Object) => r2Object.key);
}

export async function getOne(path: string, env: Env): Promise<MicropubJson> {
  console.log('getOne: ', {path, env});
  const r2Object = await env.BUCKET.get(path);

  const text = await r2Object?.text() ?? '';
  console.log('r2Object text: ', text);
  return JSON.parse(text);
}

export async function getOneFile(path: string, env: Env): Promise<ArrayBuffer | undefined> {
  console.log('getOne: ', {path, env});
  const r2Object = await env.BUCKET.get(path);
  console.log('r2Object: ', r2Object);

  return r2Object?.arrayBuffer();
}
