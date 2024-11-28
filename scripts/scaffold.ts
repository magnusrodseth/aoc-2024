import { ensureDir } from "@std/fs";

const day = Deno.args[0];
if (!day) {
  console.error("Please specify a day: deno task scaffold <day>");
  Deno.exit(1);
}

const formattedDay = day.padStart(2, "0");

const dayPath = `days/day${formattedDay}.ts`;
const inputPath = `data/inputs/day${formattedDay}.txt`;
const examplePath = `data/examples/day${formattedDay}.txt`;

await ensureDir("days");
await ensureDir("data/inputs");
await ensureDir("data/examples");

// Read the template file
const templatePath = "scripts/_template.ts";
let template = await Deno.readTextFile(templatePath);

// Replace placeholders in the template
template = template.replace(/%DAY_NUMBER%/g, formattedDay);

// Write the scaffolded files, ensuring the template overwrites any existing content
await Deno.writeTextFile(dayPath, template, { create: true, append: false });
await Deno.writeTextFile(inputPath, "", { create: true, append: false });
await Deno.writeTextFile(examplePath, "", { create: true, append: false });

console.log(`Scaffolded files for day ${day}:`);
console.log(`- ${dayPath}`);
console.log(`- ${inputPath}`);
console.log(`- ${examplePath}`);
