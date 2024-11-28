import { exists } from "@std/fs";

const day = Deno.args[0];
if (!day) {
  console.error("Please specify a day: deno task download <day>");
  Deno.exit(1);
}

const formattedDay = day.padStart(2, "0");

// Paths for session file and input/puzzle files
const sessionFilePath = `${Deno.env.get("HOME")}/.adventofcode.session`;
const inputFilePath = `data/inputs/day${formattedDay}.txt`;
const puzzleFilePath = `data/puzzles/day${formattedDay}.md`;

// Check if the `aoc` executable exists
try {
  const command = new Deno.Command("aoc", { args: ["--version"] });
  const { code } = await command.output();
  if (code !== 0) {
    throw new Error();
  }
} catch {
  console.error(
    "The `aoc` CLI tool is not installed or not accessible in your PATH. Please install it first."
  );
  console.error(
    "Read more about it here: https://github.com/scarvalhojr/aoc-cli"
  );
  Deno.exit(1);
}

// Check if the `.adventofcode.session` file exists
if (!(await exists(sessionFilePath))) {
  console.error(
    `The Advent of Code session file (${sessionFilePath}) does not exist. Please create this file and add your session cookie to download inputs.`
  );
  console.error(
    "Read more about it here: https://github.com/scarvalhojr/aoc-cli"
  );
  Deno.exit(1);
}

// Ensure directories exist for input and puzzle files
await Deno.mkdir("data/inputs", { recursive: true });
await Deno.mkdir("data/puzzles", { recursive: true });

// Run the `aoc download` command
const downloadCommand = new Deno.Command("aoc", {
  args: [
    "download",
    "--overwrite",
    "--input-file",
    inputFilePath,
    "--puzzle-file",
    puzzleFilePath,
  ],
  stdout: "piped",
  stderr: "piped",
});

try {
  const { code, stdout, stderr } = await downloadCommand.output();
  const decoder = new TextDecoder();

  if (code === 0) {
    console.log(decoder.decode(stdout));
    console.log(
      `Successfully downloaded input and puzzle for day ${formattedDay}`
    );
  } else {
    console.error(
      `Error downloading input and puzzle for day ${formattedDay}:`
    );
    console.error(decoder.decode(stderr));
  }
} catch (error) {
  console.error("Failed to execute the download command:", error);
  Deno.exit(1);
}
