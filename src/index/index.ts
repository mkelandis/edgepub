import { Env } from "../env";
import { getMany } from "../storage/get";

export async function index(req: Request, env: Env) {
  console.log('index.ts: index()');
  const links = [
    '<link rel="authorization_endpoint" href="https://indieauth.com/auth">',
    '<link rel="token_endpoint" href="https://tokens.indieauth.com/token">',
    '<link rel="micropub" href="https://pub.hintercraft.com/micropub">',    
    '<link href="https://github.com/mkelandis" rel="me">'
  ];

  // entries
  const entries = await getMany('h-entry', env);
  const entriesMarkup = entries.map(entry => `<li><a href="${entry}">${entry}</a></li>`);

  return `<html>\n<head>\n${links.join('\n')}</head>\n\n<body><h1>This service uses edgepub</h1><ul>${entriesMarkup.join('\n')}</ul></body></html>`;
}