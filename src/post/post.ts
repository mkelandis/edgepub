import { status } from 'itty-router';
import { Env } from '../env';
import { MicropubAction, MicropubJson, MicropubUpdate, postDataHandler } from '../microformats/microformats'; // Import the missing function
import { getPathPrefix } from '../path/path';
import { createOne, createOneFile, updateOne } from '../storage/post';
import { getOne } from '../storage/get';
import { isObject } from '../utils/object';

type ContentType = keyof typeof postDataHandler;

function getContentType(request: Request): ContentType {
  let contentType = request.headers.get('Content-Type') as ContentType;
  contentType = contentType.split(';')[0] as ContentType; // remove boundary for now

  console.log('contentType:', contentType);
  if (!contentType) {
    throw new Error('No Content-Type header');
  }
  return contentType
}

export async function postUpdate(req: Request, env: Env, micropubUpdate: MicropubUpdate) {

  // get the path without the host
  const path = new URL(micropubUpdate.url).pathname.substring(1);
  console.log(`update path: ${path}`);

  const micropubJson = await getOne(path, env);

  // update the data in r2 using the same path -- support the replace action
  if (micropubUpdate.replace && !isObject(micropubUpdate.replace)) {
    return status(400);
  }

  for (const [key, value] of Object.entries(micropubUpdate.replace ?? {})) {
    micropubJson.properties[key] = value;
  }

  // support the add action
  for (const [key, value] of Object.entries(micropubUpdate.add ?? {})) {
    micropubJson.properties[key] = micropubJson.properties[key] ?? [];
    micropubJson.properties[key].push(value);
  }

  // support the delete action
  if (Array.isArray(micropubUpdate.delete)) {
    for (const key of micropubUpdate.delete) {
      console.log(`deleting key: ${key}`);
      delete micropubJson.properties[key];
    }
  } else {
    for (const [key, value] of Object.entries(micropubUpdate.delete ?? {})) {
      if (Array.isArray(value)) {
        console.log(`deleting value from array: ${key}, ${value}`);
        micropubJson.properties[key] = micropubJson.properties[key] ?? [];
        micropubJson.properties[key] = micropubJson.properties[key].filter((v: any) => !value.includes(v));
      }
    }  
  }

  // store the data in r2 using the same path
  await updateOne(env, path, JSON.stringify(micropubJson, null, 2));

  // return a response
  const response = status(204);
  return response;
}

export async function post(req: Request, env: Env): Promise<Response> {

  const contentType = getContentType(req);

  // check if this is an update (really? a POST should only create stuff!)
  const payload = await postDataHandler[contentType](req) as any;
  if (payload?.action === MicropubAction.UPDATE) {
    return postUpdate(req, env, payload as MicropubUpdate);
  }

  // convert to JSON
  const micropubJson = payload as MicropubJson;

  const slug = getSlug();

  // handle any photos
  const photos: string[] = [];

  for (const photoFile of micropubJson.photoFiles ?? []) {
    console.log(`photoFiles: ${photoFile.name}, ${photoFile.size}, ${photoFile.type}`);
    const pathPrefix = getPathPrefix('h-photo');
    const path = `${pathPrefix}/${slug}/${photoFile.name}`; // Add index signature to Microformat type
    await createOneFile(env, path, photoFile);
    photos.push(`https://${env.API_HOST}/${path}`);
  }
  micropubJson.properties.photo = micropubJson.properties.photo ?? [];
  micropubJson.properties.photo.push(...photos); 
  delete micropubJson.photoFiles;

  const micropubJsonString = JSON.stringify(micropubJson, null, 2);
  console.log(`micropubJson: ${micropubJsonString}`);

  const micropubtype = micropubJson.type[0];
  const pathPrefix = getPathPrefix(micropubtype);
  const path = `${pathPrefix}/${slug}`; // Add index signature to Microformat type
  const location = `https://${env.API_HOST}/${path}`;

  // store the data in r2 using the same path
  await createOne(env, path, micropubJsonString);

  // return a response
  const response = status(201);
  response.headers.set('Location', location);
  return response;
}

function getSlug(): string {
  const today = new Date();
  return today.toISOString().replace(/[-T:Z.]/g, '');
}