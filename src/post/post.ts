import { Env } from '../env';
import { MicropubAction, MicropubJson, MicropubUpdate, postDataHandler } from '../microformats/microformats';
import { postUpdate } from './update';
import { postCreate } from './create';
import { postDelete } from './delete';
import { postUndelete } from './undelete';

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

export async function post(req: Request, env: Env): Promise<Response> {

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
