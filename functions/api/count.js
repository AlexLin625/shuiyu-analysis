export async function onRequest({ request }) {
  const targetUrl =
    "https://shuiyu-sql-proxy.linhongjie625.workers.dev/count";

  const init = {
    method: request.method,
    headers: request.headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : null,
  };

  const response = await fetch(targetUrl, init);

  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  newHeaders.set("Access-Control-Allow-Headers", "*");

  const body = await response.body;

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
