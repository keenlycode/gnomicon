import { join, resolve } from "node:path";

const root = await Deno.realPath(resolve("../docs"));
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".md", "text/markdown; charset=utf-8"],
]);
console.log("Serving docs on http://127.0.0.1:8000 (Ctrl-C to stop)");
Deno.serve({ hostname: "127.0.0.1", port: 8000 }, async (request) => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(new URL(request.url).pathname);
  } catch {
    return new Response("Bad path", { status: 400 });
  }
  const parts = decoded.split("/").filter(Boolean);
  if (
    parts.some((part) =>
      part === "." || part === ".." || part.includes("\\") ||
      part.includes("\0")
    )
  ) return new Response("Bad path", { status: 400 });
  const path = join(root, ...(parts.length ? parts : ["index.html"]));
  try {
    const real = await Deno.realPath(path);
    if (!real.startsWith(root + "/")) {
      return new Response("Not found", { status: 404 });
    }
    const info = await Deno.stat(real);
    if (!info.isFile) return new Response("Not found", { status: 404 });
    const extension = real.slice(real.lastIndexOf("."));
    return new Response(await Deno.readFile(real), {
      headers: {
        "content-type": mime.get(extension) ?? "application/octet-stream",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response("Not found", { status: 404 });
    }
    throw error;
  }
});
