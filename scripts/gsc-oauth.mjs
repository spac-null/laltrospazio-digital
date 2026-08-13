import path from "node:path";
import { fileURLToPath } from "node:url";
import { authorizeLoopback } from "./google-local-oauth.mjs";
import { GSC_ENV_FILE, GSC_SCOPE, GSC_TOKEN_FILE, loadLocalGscEnv, requireGscCredentials } from "./gsc-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalGscEnv(root);
let credentials;
try { credentials = requireGscCredentials(); } catch (error) { console.error(`GSC AUTHORIZATION BLOCKED\n${error.message}`); process.exit(1); }
await authorizeLoopback({ ...credentials, scope: GSC_SCOPE, port: Number(process.env.GSC_OAUTH_PORT ?? 8788), tokenPath: path.join(root, GSC_TOKEN_FILE), label: "L'Altro Spazio Search Console" });
console.log(`Credentials are loaded from ${GSC_ENV_FILE}; the refresh token is stored separately and was not displayed.`);
