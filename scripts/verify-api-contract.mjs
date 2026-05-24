import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const buildRoot = path.resolve(process.cwd(), '.next/server/app/api/library');

function loadRoute(routePath) {
  const route = require(routePath);
  return route.routeModule?.userland ?? route;
}

async function readJsonResponse(response) {
  if (!response || typeof response.json !== 'function') {
    throw new Error('Route did not return a Response object');
  }

  return response.json();
}

async function verifyRootRoute() {
  const { GET } = loadRoute(path.join(buildRoot, 'route.js'));
  const defaultResponse = await GET(new Request('http://localhost/api/library'));
  const defaultJson = await readJsonResponse(defaultResponse);

  if (defaultJson.provider !== 'anime-repo') {
    throw new Error(`Expected default provider anime-repo, received ${defaultJson.provider}`);
  }

  const mangaResponse = await GET(new Request('http://localhost/api/library?provider=manga-repo'));
  const mangaJson = await readJsonResponse(mangaResponse);

  if (mangaJson.provider !== 'manga-repo') {
    throw new Error(`Expected requested provider manga-repo, received ${mangaJson.provider}`);
  }
}

async function verifyCategoryRoute(routeFileName, expectedProvider, key) {
  const { GET } = loadRoute(path.join(buildRoot, routeFileName, 'route.js'));
  const response = await GET(new Request(`http://localhost/api/library/${routeFileName}?provider=mock`));
  const json = await readJsonResponse(response);

  if (json.provider !== expectedProvider) {
    throw new Error(`Expected ${expectedProvider}, received ${json.provider}`);
  }

  if (!Array.isArray(json[key]) || json[key].length === 0) {
    throw new Error(`Expected ${key} array with entries for ${routeFileName}`);
  }
}

async function main() {
  await verifyRootRoute();
  await verifyCategoryRoute('anime', 'anime-repo', 'anime');
  await verifyCategoryRoute('manga', 'manga-repo', 'manga');
  console.log('API contract verified');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});