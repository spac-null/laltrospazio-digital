export function validateOAuthCallback(requestUrl, expectedState, baseUrl) {
  const url = new URL(requestUrl, baseUrl);
  if (url.searchParams.get("state") !== expectedState) throw new Error("OAuth state mismatch");
  if (url.searchParams.get("error")) throw new Error("Facebook authorization was denied");
  const code = url.searchParams.get("code");
  if (!code) throw new Error("Missing authorization code");
  return code;
}
