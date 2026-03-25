#!/usr/bin/env node

const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const ROOT = __dirname;
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 4173);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2"
};

function resolvePathname(urlPathname) {
  const cleanPath = urlPathname === "/" ? "/index.html" : urlPathname;
  const filePath = path.resolve(ROOT, `.${cleanPath}`);
  return filePath.startsWith(ROOT) ? filePath : null;
}

function getContentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function shouldFallbackToIndex(urlPathname) {
  return !path.extname(urlPathname);
}

async function readPublicFile(urlPathname) {
  const resolved = resolvePathname(urlPathname);
  if (!resolved) {
    const error = new Error("Forbidden path");
    error.statusCode = 403;
    throw error;
  }

  try {
    const stats = await fs.stat(resolved);
    const target = stats.isDirectory() ? path.join(resolved, "index.html") : resolved;
    return {
      filePath: target,
      body: await fs.readFile(target)
    };
  } catch (error) {
    if (error.code === "ENOENT" && shouldFallbackToIndex(urlPathname)) {
      const indexPath = path.join(ROOT, "index.html");
      return {
        filePath: indexPath,
        body: await fs.readFile(indexPath)
      };
    }

    error.statusCode = error.statusCode || (error.code === "ENOENT" ? 404 : 500);
    throw error;
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${HOST}:${PORT}`);

  try {
    const { filePath, body } = await readPublicFile(requestUrl.pathname);
    response.writeHead(200, {
      "Content-Type": getContentType(filePath),
      "Cache-Control": filePath.endsWith(".html") ? "no-cache" : "public, max-age=300"
    });
    response.end(body);
  } catch (error) {
    response.writeHead(error.statusCode || 500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error.statusCode === 404 ? "Not found" : "Server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Daker Hub static server running at http://${HOST}:${PORT}/`);
});
