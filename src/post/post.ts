import { status } from 'itty-router';

export const Microformat = {
  entry: 'entries'
}

export async function post(request: Request): Promise<Response> {
  const formData = await request.formData();
  const h = formData.get('h');
  // const content = formData.get('content');
  const slug = getSlug();
  const location = `https://pub.hintercraft.com/micropub/${Microformat[h]}/${slug}`;
  const response = status(201);
  response.headers.set('Location', location); 
  return response;
}

function getSlug(): string {
  const today = new Date();
  return today.toISOString().replace(/[-T:Z.]/g, '');
 }