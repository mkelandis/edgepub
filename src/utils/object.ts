export function isObject(item: any): item is Object {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
