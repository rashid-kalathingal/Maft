import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  seedCategories,
  seedColours,
  seedSettings,
  buildSeedProducts,
  buildSeedSizes,
} from "../src/data/seed.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../backend/src/main/resources/seed");
mkdirSync(outDir, { recursive: true });

const products = buildSeedProducts();
const sizes = buildSeedSizes();

const write = (name: string, data: unknown) =>
  writeFileSync(`${outDir}/${name}.json`, JSON.stringify(data, null, 2));

write("categories", seedCategories);
write("colours", seedColours);
write("sizes", sizes);
write("products", products);
write("settings", seedSettings);

console.log(
  `seeded: ${seedCategories.length} categories, ${seedColours.length} colours, ${sizes.length} sizes, ${products.length} products`,
);
