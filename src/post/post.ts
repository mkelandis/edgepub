import { status } from 'itty-router';
import { Env } from '../env';

export const Microformat = {
  entry: 'entries'
}

interface MicropubObject {
  h: keyof typeof Microformat;
  content: string;
  category: string[];
}

function toMicropubObject(formData: FormData): MicropubObject {
  return {
    h: formData.get('h') as keyof typeof Microformat,
    content: formData.get('content') as string,
    category: formData.getAll('category[]') as string[]
  }
}

export async function post(request: Request, env: Env): Promise<Response> {

  // const requestJson = await request.json<{}>()
  // console.log('request json', requestJson);


  const formData = await request.formData();

  console.log('formData entries', {entries: formData.entries()});
  console.log('formData keys', {entries: formData.keys()});

  // convert to JSON
  const micropubObject = toMicropubObject(formData);
  console.log('post micropubObject', {micropubObject});

  const slug = getSlug();
  const path = `micropub/${Microformat[micropubObject.h]}/${slug}`;
  const location = `https://${env.API_HOST}/${path}`;

  // store the data in r2 using the same path
  await env.BUCKET.put(path, JSON.stringify(micropubObject, null, 2));

  // return a response
  const response = status(201);
  response.headers.set('Location', location);
  return response;
}

function getSlug(): string {
  const today = new Date();
  return today.toISOString().replace(/[-T:Z.]/g, '');
 }