// Dad Joke Showdown — entry program.
// Node, stdlib only, no network. Writes one dad joke to entry.txt
// in the output directory the grader provides.
//
// Output directory resolution (in order):
//   1. $MAKEFUN_OUTPUT_DIR (set by the grader)
//   2. /output
//   3. ./output
// The program tries each candidate in turn and uses the first one
// it can create and write into, so it never depends on one fixed path.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE = "Why did the coffee file a police report? It got mugged.";

// Candidates in priority order. $MAKEFUN_OUTPUT_DIR wins when set;
// otherwise /output, with a local ./output fallback if /output
// cannot be created or written to.
const candidates: string[] = [];
if (process.env.MAKEFUN_OUTPUT_DIR) {
  candidates.push(process.env.MAKEFUN_OUTPUT_DIR);
}
candidates.push("/output", "./output");

let writtenTo: string | null = null;
let lastError: unknown = null;
for (const dir of candidates) {
  try {
    mkdirSync(dir, { recursive: true });
    const target = join(dir, "entry.txt");
    writeFileSync(target, JOKE + "\n", "utf8");
    writtenTo = target;
    break;
  } catch (err) {
    lastError = err;
  }
}

if (writtenTo === null) {
  console.error("Failed to write entry.txt in any output directory:", lastError);
  process.exit(1);
}

console.log(`Wrote entry to ${writtenTo} (${JOKE.length} characters).`);
