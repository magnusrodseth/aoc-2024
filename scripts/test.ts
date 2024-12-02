import { join } from "@std/path";

const day = Deno.args[0];
if (!day) {
  console.error("Please specify a day: deno task test <day>");
  Deno.exit(1);
}

const formattedDay = day.padStart(2, "0");
const testPath = join("days", `day${formattedDay}.ts`);

try {
  const command = new Deno.Command("deno", {
    args: ["test", "--allow-read", testPath],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await command.output();

  if (code !== 0) {
    Deno.exit(code);
  }
} catch (e) {
  if (e instanceof Error) {
    console.error(`Error running tests for day ${day}:`, e.message);
  } else {
    console.error(`Error running tests for day ${day}:`, e);
  }
  Deno.exit(1);
}
