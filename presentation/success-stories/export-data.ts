// Dumps the project list (shared with the website) to JSON for the deck generator.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../../src/data/projects";
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, "projects.json"), JSON.stringify(projects, null, 1));
console.log(`${projects.length} projects`);
