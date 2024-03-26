import { Env } from "../env";
import { MicropubJson } from "../microformats/microformats";
import { getPathPrefix } from "../path/path";
import { getOne, getOneFile } from "../storage/get";
import { IRequest } from "itty-router"

function toMicropubHtml(micropubJson: MicropubJson): string {

  let html = `<div class="${micropubJson.type[0]}">`;
  
  for (const [key, values] of Object.entries(micropubJson.properties)) {
    switch (key) {
      case 'content':
        for (let value of values) {
          value = value?.html ?? value; 
          if (value) {
            html += `<div class="e-content">${value}</div>`;
          } 
        }
        break;
      case 'photo':
        for (let value of values) {
          const src = value?.value ?? value;
          const alt = value?.alt ?? '';
          if (value) {
            html += `<img src="${src}" alt="${alt}" width="90%"/>`;
          }
        }
        break;
      case 'category':
        for (const value of values) {
          if (value) {
            html += `<div class="p-category">${value}</div>`;
          }
        }
        break;
      default:
        for (const value of values) {
          if (value?.type) {
            html += `<div class="${key}"><p><strong>${key}</strong></p>`;
            html += toMicropubHtml(value);
          } else if (value) {
            html += `<div>${key}: ${value}</div>`;
          }
        }
        html += '</div>';
        break;
    }
  }

  html += '</div>';
  return html;
}

export async function getMicropubEntry(req: IRequest, env: Env) {
  console.log('getMicropubEntry:', {slug: req.params.slug});
  const pathPrefix = getPathPrefix('h-entry');
  const micropubJson = await getOne(`${pathPrefix}/${req.params.slug}`, env);
  if (!micropubJson) {
    return new Response('Not found', { status: 404 });
  }

  console.log('micropubJson:', JSON.stringify(micropubJson));

  return new Response(`<html>\n<head></head>\n\n<h1>This service uses edgepub</h1><ul>${toMicropubHtml(micropubJson)}</ul></body></html>`, { headers: { 'Content-Type': 'text/html' } });
}

export async function getMicropubPhoto(req: IRequest, env: Env): Promise<Response> {
  console.log('getMicropubPhoto:', {slug: req.params.slug});
  const pathPrefix = getPathPrefix('h-photo');
  const data = await getOneFile(`${pathPrefix}/${req.params.slug}/${req.params.filename}`, env);
  return new Response(data, {
    headers: { 'Content-Type': 'image/jpeg' }
  });
}