import { status } from 'itty-router';
import { Env } from '../env';
import { MicropubJson, Microformat, postDataHandler } from '../microformats/microformats'; // Import the missing function

type ContentType = keyof typeof postDataHandler;

async function toMicropubJson(request: Request): Promise<MicropubJson> {
  const contentType = request.headers.get('Content-Type') as ContentType;
  if (!contentType) {
    throw new Error('No Content-Type header');
  }

  return await postDataHandler[contentType](request);
}


export async function post(request: Request, env: Env): Promise<Response> {

  // convert to JSON
  const micropubJson = await toMicropubJson(request);
  const micropubJsonString = JSON.stringify(micropubJson, null, 2);
  console.log(`micropubJson: ${micropubJsonString}`);

  const slug = getSlug();
  const micropubtype = micropubJson.type[0];
  const folder = Microformat[micropubtype];
  const path = `micropub/${folder}/${slug}`; // Add index signature to Microformat type
  const location = `https://${env.API_HOST}/${path}`;

  // store the data in r2 using the same path
  await env.BUCKET.put(path, micropubJsonString);

  // return a response
  const response = status(201);
  response.headers.set('Location', location);
  return response;
}

function getSlug(): string {
  const today = new Date();
  return today.toISOString().replace(/[-T:Z.]/g, '');
 }