export const MicroformatFolder: any = {
  "h-entry": 'entries',
  "h-photo": 'photos',
  "h-media": 'media',
}

export type MicroformatType = keyof typeof MicroformatFolder;

export interface MicropubJson {
  type: string[];
  properties: any;
  photoFiles?: any[];
  mediaFiles?: any[];
}

export interface MicropubMedia {
  files: any[];
}

export enum MicropubAction {
  UPDATE = "update",
  DELETE = "delete",
  UNDELETE = "undelete",
}

export interface MicropubUpdate {
  action: MicropubAction;
  url: string;
  replace?: any;
  add?: any;
  delete?: any;
}

export type MicropubPayload = MicropubJson | MicropubUpdate;

export async function fromFormUrlEncoded(request: Request): Promise<MicropubPayload> {

  const formData = await request.formData();
	console.log('formData', JSON.stringify(formData));

  // check for an action property
  const action = formData.get('action');
  if (!!action) {
    return {
      action: action as MicropubAction,
      url: formData.get('url') as string,
      // replace: formData.get('replace') as any,
      // add: formData.get('add') as any,
      // delete: formData.get('delete') as any,
    } as MicropubUpdate;
  }



  const category = formData.getAll('category[]') as string[];
  if (category.length === 0) {
    category.push(formData.get('category') as string);
  }

  const type = formData.get('h');
  const content = formData.get('content');
  const photo = formData.get('photo');

  return {
    type: [`h-${type}`],
    properties: {
      content: content ? [content] : undefined,
      category: category.length > 0 ? category : undefined,
      photo: photo ? [photo] : undefined,
    }
  }
}

// todo::filter these by known properties
export async function fromJson(request: Request): Promise<MicropubPayload> {
  const payload = await request.json<MicropubPayload>();
  return payload;
}

export async function fromMultipartFormData(request: Request): Promise<MicropubJson> {

  const formData = await request.formData();
  console.log('fromMultipartFormData:', {formData});

  formData.forEach((value, key) => {
    console.log('key:', key);
    console.log('value:', value);
  });

  const content = formData.get('content');
  const category = formData.getAll('category[]') as string[];
  if (category.length === 0) {
    category.push(formData.get('category') as string);
  }

  const photoFiles = formData.getAll('photo[]') as File[];
  if (photoFiles.length === 0) {
    const photo = formData.get('photo') as File;
    if (photo) {
      photoFiles.push(photo);
    }
  }

  const mediaFiles = formData.getAll('file[]') as File[];
  if (mediaFiles.length === 0) {
    const mediaFile = formData.get('file') as File;
    if (mediaFile) {
      mediaFiles.push(mediaFile);
    }
  }

  const type = formData.get('h') ?? 'media'; // default to media (this is magical)
  console.log('type:', type);

  return {
    type: [`h-${type}`],
    properties: {
      content: content ? [content] : undefined,
      category: category.length > 0 ? category : undefined,
    },
    photoFiles,
    mediaFiles
  }
}

export const postDataHandler = {
  "application/json": fromJson,
  "multipart/form-data": fromMultipartFormData,
  "application/x-www-form-urlencoded": fromFormUrlEncoded,
}
