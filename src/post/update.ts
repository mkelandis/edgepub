import { status } from "itty-router";
import { getOne } from "../storage/get";
import { isObject } from "../utils/object";
import { Env } from "../env";
import { MicropubUpdate } from "../microformats/microformats";
import { updateOne } from "../storage/update";
import { getPathFromUrl } from "../path/path";

export async function postUpdate(env: Env, micropubUpdate: MicropubUpdate) {

  const path = getPathFromUrl(micropubUpdate.url);
  console.log(`update path: ${path}`);

  const micropubJson = await getOne(path, env);
  if (!micropubJson) {
    return status(404);
  }

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
