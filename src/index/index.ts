export function index() {
  console.log('index.ts: index()');
  const links = [
    '<link rel="authorization_endpoint" href="https://indieauth.com/auth">',
    '<link rel="token_endpoint" href="https://tokens.indieauth.com/token">',
    '<link rel="micropub" href="https://pub.hintercraft.com/micropub">',    
    '<link href="https://github.com/mkelandis" rel="me">'
  ];
  return `<html>\n<head>\n${links.join('\n')}</head>\n\n<body><h1>This service uses edgepub</h1></body></html>`;
}