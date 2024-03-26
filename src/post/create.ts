import { status } from "itty-router";
import { Env } from "../env";
import { MicropubJson } from "../microformats/microformats";
import { getPathPrefix } from "../path/path";
import { createOne, createOneFile } from "../storage/post";

function getSlug(): string {
  const today = new Date();
  return today.toISOString().replace(/[-T:Z.]/g, '');
}

export async function postCreate(env: Env, micropubJson: MicropubJson) {
 
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