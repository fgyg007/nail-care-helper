import { mkdir, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
await mkdir('www', { recursive: true });
await copyFile('src/index.html', 'www/index.html');
execFileSync(process.execPath, ['node_modules/tailwindcss/lib/cli.js', '-i', 'src/styles.css', '-o', 'www/styles.css', '--minify'], { stdio: 'inherit' });
await build({ entryPoints: ['src/native.js'], bundle: true, outfile: 'www/native.js', format: 'iife', target: 'chrome90', minify: true });
