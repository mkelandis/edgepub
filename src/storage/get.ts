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

export async function getOne(path: string, env: Env): Promise<MicropubJson | null> {
  console.log('getOne: ', {path, env});
  const r2Object = await env.BUCKET.get(path);
  if (!r2Object) {
    console.log('r2Object not found: ', path);
    return null;
  }
  const text = await r2Object.text() ?? '';
  console.log('r2Object text: ', text);
  return JSON.parse(text);
}

export interface MicropubFile {
  type: string;
  size: number | undefined;
  arrayBuffer: Promise<ArrayBuffer> | undefined;  
}

export async function getOneFile(path: string, env: Env): Promise<MicropubFile> {
  console.log('getOne: ', {path, env});

  const r2ObjectHead = await env.BUCKET.head(path);
  console.log('r2ObjectHead: ', r2ObjectHead);

  const r2Object = await env.BUCKET.get(path);
  console.log('r2Object: ', r2Object);

  return {
    type: r2ObjectHead?.httpMetadata?.contentType ?? 'image/jpeg', // for legacy reasons
    size: r2ObjectHead?.size,
    arrayBuffer: r2Object?.arrayBuffer()
  };
}
