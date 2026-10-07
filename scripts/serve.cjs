const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const { refresh } = require("./previews.cjs");
const updatePreviews = () =>
  refresh().catch((error) =>
    console.warn(`Using saved previews: ${error.message}`),
  );
updatePreviews();
setInterval(updatePreviews, 6 * 60 * 60 * 1000).unref();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      response.writeHead(400);
      return response.end();
    }
    const file = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    const relative = path.relative(root, file);
    if (
      relative.startsWith("..") ||
      path.isAbsolute(relative) ||
      relative.split(path.sep).some((segment) => segment.startsWith("."))
    ) {
      response.writeHead(403);
      return response.end();
    }
    fs.stat(file, (error, stat) => {
      if (error || !stat.isFile()) {
        response.writeHead(404);
        return response.end("Not found");
      }
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      fs.createReadStream(file).pipe(response);
    });
  })
  .listen(Number(process.env.PORT) || 4173, "127.0.0.1", () =>
    console.log(
      `Portfolio: http://127.0.0.1:${Number(process.env.PORT) || 4173}`,
    ),
  );
