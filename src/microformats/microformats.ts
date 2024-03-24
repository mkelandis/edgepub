export const Microformat: any = {
  "h-entry": 'entries',
}

export interface MicropubJson {
  type: string[];
  properties: object;
}

export async function fromFormUrlEncoded(request: Request): Promise<MicropubJson> {

  const formData = await request.formData();

  const category = formData.getAll('category[]') as string[];
  if (category.length === 0) {
    category.push(formData.get('category') as string);
  }

  const type = formData.get('h');

  return {
    type: [`h-${type}`],
    properties: {
      content: [formData.get('content') as string],
      category,
      photo: [formData.get('photo') as string]
    }
  }
}

export async function fromJson(request: Request): Promise<MicropubJson> {
  const micropubJson = await request.json<MicropubJson>();
  return micropubJson; 
}

export const postDataHandler = {
  "application/x-www-form-urlencoded": fromFormUrlEncoded,
  "application/json": fromJson
}

