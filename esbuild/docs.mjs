import * as esbuild from 'esbuild'
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';


const __file = fileURLToPath(import.meta.url);
const __dir = path.dirname(__file);

const docs_src_dir = path.join(__dir, '../docs-src/');
const docs_dir = path.join(__dir, '../docs/');

let files = path.join(docs_src_dir, '**/*.{js,ts}');
let ignores = [
    path.join(docs_src_dir, '**/_*.{js,ts}')
];

files = await glob(files, {ignore: ignores});

let server = await esbuild.context({
    entryPoints: files,
    outdir: docs_dir,
    bundle: true,
    format: "esm",
    keepNames: true,
})
  
let { host, port } = await server.serve({
    servedir: 'docs',
});

console.log(`esbuild server: http://${host}:${port}`);

await server.watch();

console.log('esbuild watching...');