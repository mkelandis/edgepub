import { Env } from '../env';
import { MicropubAction, MicropubJson, MicropubUpdate, postDataHandler } from '../microformats/microformats';
import { postUpdate } from './update';
import { postCreate } from './create';
import { postDelete } from './delete';
import { postUndelete } from './undelete';
import { a } from 'vitest/dist/suite-ghspeorC';

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


async function authenticate(req: Request) {
	let accessTokenHeader = null;
	let accessTokenPost = null;

	// Step 1: Try Authorization header
	const authHeader = req.headers.get('Authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		accessTokenHeader = authHeader.slice(7); // Remove "Bearer "
		console.log('accessTokenHeader:', accessTokenHeader);
	}

	// Step 2: If no header, try POST body
	if (req.method === 'POST') {
		const contentType = req.headers.get('Content-Type') || '';
		if (contentType.includes('application/multipart/form-data') ||
				contentType.includes('multipart/form-data')) {
			const formData = await req.clone().formData(); // clone to preserve original body
			accessTokenPost = formData.get('access_token');
			console.log('accessTokenPost:', accessTokenPost);
		}
	}

	if (accessTokenHeader && accessTokenPost) {
		return new Response('Bad Request: Multiple access tokens found', { status: 400 });
	}

	// Step 3: If still no token, reject
	const accessToken = accessTokenHeader ?? accessTokenPost;
	console.log('accessToken:', accessToken);
	if (!accessToken) {
		return new Response('Unauthorized: No access token found', { status: 401 });
	}

	const res = await fetch('https://tokens.indieauth.com/token', {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Accept': 'application/json',
		},
	});

	if (!res.ok) {
		return new Response('Invalid or expired token', { status: 401 });
	}
}

export async function post(req: Request, env: Env): Promise<Response> {

	const authResponse = await authenticate(req);
	if (authResponse) {
		return authResponse;
	}

	const contentType = getContentType(req);
  const payload = await postDataHandler[contentType](req) as any;

	switch (payload?.action) {
    case MicropubAction.UPDATE:
      return postUpdate(env, payload as MicropubUpdate);
    case MicropubAction.DELETE:
      return postDelete(env, payload as MicropubUpdate);
    case MicropubAction.UNDELETE:
      return postUndelete(env, payload as MicropubUpdate);
    default:
      return postCreate(env, payload as MicropubJson);
  }

}
