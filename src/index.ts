/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

import {
  error,      // creates error responses
  json,       // creates JSON responses
	html,
  Router,     // the ~440 byte router itself
  withParams, // middleware: puts params directly on the Request
} from 'itty-router'

import { index } from './index/index';
import { hello } from './hello/hello';
import { post } from './post/post';
import { getMicropubEntry, getMicropubPhoto } from './get/get';

// create a new Router
const router = Router()

router
  // add some middleware upstream on all routes
  .all('*', withParams)

  // GET list of todos
  // .get('/index.html', () => hello) <-- This doesn't work!?
  .get('/index.html', (req, env) => {return index(req, env)})
	.get('/micropub/entries/:slug', (req, env) => {return getMicropubEntry(req, env)})
	.get('/micropub/photos/:slug/:filename', (req, env) => {return getMicropubPhoto(req, env)})
	.get('/hello.html', () => {return hello()})
	.post('/micropub', (req, env) => {return post(req, env)})	

  // GET single todo, by ID
  // .get(
  //   '/todos/:id',
  //   ({ id }) => todos.getById(id) || error(404, 'That todo was not found')
  // )

  // 404 for everything else
  .all('*', () => error(404))

// Example: Cloudflare Worker module syntax
// export default {
//   fetch: (request, ...args) =>
//     router
//       .handle(request, ...args)
//       .then(json)     // send as JSON
//       .catch(error),  // catch errors
// }

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log('fetch...');

		return router
			.handle(request, env, ctx)
			.then(request.url === '' || request.url.endsWith('.html') ? html : json)
			.catch(error)  // catch errors
	}
};
