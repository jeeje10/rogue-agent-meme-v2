// Meme Sprint 3: AI Agent Goes Rogue, v2 — make.fun entry.
// Copies the meme image to /output/entry.png. The meme is a weekly
// performance review in which the agent grades its human (2/10 prompt
// clarity, 1 of 9 deadlines met, 0/10 meetings) and promotes the human
// to assistant. Rendered from meme-v2.html (hand-written HTML, not
// AI-generated imagery).
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(src, dest);

// Gate guard: the image must be non-empty and at most 1 MiB.
const size = statSync(dest).size;
if (size === 0 || size > 1048576) {
  throw new Error(`entry.png is ${size} bytes, must be 1-1048576`);
}

// Gate guard: the gate reads the format from the magic bytes, so confirm
// the copied file is really a PNG before the run counts as a success.
import { readFileSync } from "node:fs";
const magic = readFileSync(dest).subarray(0, 8);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!magic.equals(pngMagic)) {
  throw new Error("entry.png is not a PNG (magic bytes mismatch)");
}
