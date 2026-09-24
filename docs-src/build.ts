import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const marker = ".gnomicon-docs-output";
type BuildOptions = { source: string; output: string };

async function copyTree(source: string, destination: string) {
  await Deno.mkdir(destination, { recursive: true });
  for await (const entry of Deno.readDir(source)) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory) await copyTree(from, to);
    else if (entry.isFile) await Deno.copyFile(from, to);
  }
}

async function fileExists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}
function inside(parent: string, child: string) {
  return child === parent || child.startsWith(parent + "/");
}

export async function build({ source, output }: BuildOptions) {
  source = await Deno.realPath(source);
  const outputPath = resolve(output);
  if (
    outputPath === "/" || inside(outputPath, source) ||
    inside(source, outputPath)
  ) {
    throw new Error(
      "Unsafe output path: output must not be root or inside source assets",
    );
  }
  const manifestPath = join(source, "icons.json");
  const manifest = JSON.parse(await Deno.readTextFile(manifestPath)) as {
    version: string;
    icons: Icon[];
    sources: Source[];
  };
  if (
    !Array.isArray(manifest.icons) || !Array.isArray(manifest.sources) ||
    typeof manifest.version !== "string"
  ) throw new Error("Invalid dist/icons.json schema");
  for (const icon of manifest.icons) {
    if (
      !icon.name || !icon.exportName || !icon.source ||
      !icon.svg.startsWith("svg/") ||
      icon.svg.slice(4).includes("/") ||
      /[\\\\\0]/.test(icon.svg) ||
      !icon.svg.endsWith(".svg") ||
      [".", ".."].includes(icon.svg.slice(4, -4))
    ) throw new Error(`Invalid icon manifest entry: ${icon.name}`);
    if (!await fileExists(join(source, icon.svg))) {
      throw new Error(`Missing icon asset: ${icon.svg}`);
    }
  }
  for (const required of ["LICENSE.md"]) {
    if (!await fileExists(join(source, required))) {
      throw new Error(`Missing required dist asset: ${required}`);
    }
  }

  const parent = dirname(outputPath);
  await Deno.mkdir(parent, { recursive: true });
  if (await fileExists(outputPath)) {
    const info = await Deno.lstat(outputPath);
    if (
      info.isSymlink || !info.isDirectory ||
      await Deno.readTextFile(join(outputPath, marker)).catch(() => "") !==
        "Gnomicon generated docs output v1\n"
    ) {
      throw new Error(
        `Refusing to replace unmarked output directory: ${outputPath}`,
      );
    }
  }
  const stage = join(parent, `.gnomicon-docs-stage-${crypto.randomUUID()}`);
  try {
    await Deno.mkdir(stage);
    const lib = join(stage, "lib", "gnomicon");
    await Deno.mkdir(join(lib, "svg"), { recursive: true });
    await Deno.copyFile(manifestPath, join(lib, "icons.json"));
    for (const icon of manifest.icons) {
      await Deno.copyFile(join(source, icon.svg), join(lib, icon.svg));
    }
    await Deno.copyFile(join(source, "LICENSE.md"), join(lib, "LICENSE.md"));
    const licenses = join(source, "licenses");
    if (await fileExists(licenses)) {
      await copyTree(licenses, join(lib, "licenses"));
    }
    await Deno.copyFile(join(HERE, "index.html"), join(stage, "index.html"));
    await Deno.copyFile(
      join(HERE, "vendor", "README.md"),
      join(stage, "UI-NOTICES.md"),
    );
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["bundle", join(HERE, "app.ts"), "-o", join(stage, "app.js")],
      stdout: "inherit",
      stderr: "inherit",
    }).output();
    if (!result.success) {
      throw new Error(`deno bundle failed with exit code ${result.code}`);
    }
    await Deno.writeTextFile(
      join(stage, marker),
      "Gnomicon generated docs output v1\n",
    );
    if (await fileExists(outputPath)) {
      await Deno.remove(outputPath, { recursive: true });
    }
    await Deno.rename(stage, outputPath);
  } catch (error) {
    await Deno.remove(stage, { recursive: true }).catch(() => {});
    throw error;
  }
}

type Icon = { name: string; exportName: string; source: string; svg: string };
type Source = {
  id: string;
  repository: string;
  revision: string;
  license: string;
};
function cliOptions(args: string[]): BuildOptions {
  const options = new Map<string, string>();
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (key !== "--source" && key !== "--out") {
      throw new Error(`Unknown option ${key}`);
    }
    if (!args[index + 1] || args[index + 1].startsWith("--")) {
      throw new Error(`Expected a path after ${key}`);
    }
    options.set(key, args[++index]);
  }
  return {
    source: resolve(options.get("--source") ?? join(HERE, "../dist")),
    output: resolve(options.get("--out") ?? join(HERE, "../docs")),
  };
}
if (import.meta.main) await build(cliOptions(Deno.args));

Deno.test("build copies manifest, icon assets, licenses and standalone app into safe marked output", async () => {
  const temp = await Deno.makeTempDir();
  const source = join(temp, "input");
  const output = join(temp, "output");
  try {
    await Deno.mkdir(join(source, "svg"), { recursive: true });
    await Deno.mkdir(join(source, "licenses", "fixture"), { recursive: true });
    const manifest = {
      version: "51.0.0",
      sources: [{
        id: "fixture",
        repository: "https://example.test",
        revision: "abc123",
        license: "CC0-1.0",
      }],
      icons: [{
        name: "folder",
        exportName: "folder",
        source: "fixture",
        svg: "svg/folder.svg",
      }],
    };
    await Deno.writeTextFile(
      join(source, "icons.json"),
      JSON.stringify(manifest),
    );
    await Deno.writeTextFile(join(source, "LICENSE.md"), "license");
    await Deno.writeTextFile(
      join(source, "svg", "folder.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg"/>',
    );
    await Deno.writeTextFile(
      join(source, "licenses", "fixture", "COPYING"),
      "fixture license",
    );
    await build({ source, output });
    const copied = JSON.parse(
      await Deno.readTextFile(join(output, "lib/gnomicon/icons.json")),
    );
    if (copied.icons[0].exportName !== "folder") {
      throw new Error("manifest was not copied");
    }
    if (
      await Deno.readTextFile(
        join(output, "lib/gnomicon/licenses/fixture/COPYING"),
      ) !== "fixture license"
    ) throw new Error("license was not copied");
    if (!await fileExists(join(output, "app.js"))) {
      throw new Error("bundle missing");
    }
  } finally {
    await Deno.remove(temp, { recursive: true });
  }
});
Deno.test("build rejects missing assets, traversal and unmarked destructive output", async () => {
  const temp = await Deno.makeTempDir();
  try {
    await Deno.mkdir(join(temp, "input"));
    await Deno.mkdir(join(temp, "unsafe"));
    await Deno.writeTextFile(join(temp, "unsafe", "keep"), "do not delete");
    await Deno.writeTextFile(
      join(temp, "input", "icons.json"),
      JSON.stringify({ version: "51.0.0", sources: [], icons: [] }),
    );
    for (
      const options of [{
        source: join(temp, "input"),
        output: join(temp, "unsafe"),
      }, { source: join(temp, "input"), output: join(temp, "input", "nested") }]
    ) {
      try {
        await build(options);
        throw new Error("expected rejected build");
      } catch (error) {
        if (
          !(error instanceof Error) ||
          error.message === "expected rejected build"
        ) throw error;
      }
    }
    if (
      await Deno.readTextFile(join(temp, "unsafe", "keep")) !== "do not delete"
    ) throw new Error("unmarked output was modified");
  } finally {
    await Deno.remove(temp, { recursive: true });
  }
});
