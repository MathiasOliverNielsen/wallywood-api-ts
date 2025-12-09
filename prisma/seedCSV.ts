// Fil: ./prisma/seedCSV.ts
import path from "path";
import bcrypt from "bcrypt";
import { readdir, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { fieldTypes } from "./types.js";
import { prisma } from "../src/prisma.js";

const models = Object.keys(fieldTypes);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, "csv");

async function main() {
  const csvFiles = (await readdir(dir)).filter((f) => f.endsWith(".csv"));

  for (const model of models) {
    const file = `${model}.csv`;
    if (!csvFiles.includes(file)) continue;
    const raw = parse(await readFile(path.join(dir, file), "utf-8"), {
      columns: true,
      skip_empty_lines: true,
    });

    const data = await Promise.all(raw.map((row: any) => cast(model, row)));
    await (prisma as any)[model].createMany({ data, skipDuplicates: true });
  }
}

async function cast(model: string, row: any) {
  const types = fieldTypes[model];
  const out: any = {};

  for (const key in row) {
    const val = row[key]?.toString().trim();
    const type = types[key];

    if (key === "password") {
      out[key] = await bcrypt.hash(val, 10);
    } else if (type === "number") {
      out[key] = Number(val);
    } else if (type === "boolean") {
      out[key] = val !== "0";
    } else if (type === "date") {
      // Hvis værdien er tom eller undefined, lad Prisma håndtere @default(now())
      if (val && val !== "") {
        out[key] = new Date(val);
      }
      // Hvis tom, spring over så Prisma bruger default
    } else {
      out[key] = val ?? null;
    }
  }

  // Tilføj createdAt hvis den ikke findes og modellen har den
  if (types.createdAt && !out.createdAt) {
    out.createdAt = new Date();
  }

  return out;
}

main()
  .then(() => console.log("seed done"))
  .finally(() => prisma.$disconnect());
