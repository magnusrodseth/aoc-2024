const day = Deno.args[0];
if (!day) {
  console.error("Please specify a day: deno task solve <day>");
  Deno.exit(1);
}

const formattedDay = day.padStart(2, "0");

const inputPath = `data/inputs/day${formattedDay}.txt`;

try {
  const { partOne, partTwo } = await import(`../days/day${formattedDay}.ts`);
  const input = await Deno.readTextFile(inputPath);
  console.log(`Solving day ${day}...`);
  console.log("Part One:\n", partOne(input));
  console.log("Part Two:\n", partTwo(input));
} catch (e) {
  if (e instanceof Error) {
    console.error(`Error solving day ${day}:`, e.message);
  } else {
    console.error(`Error solving day ${day}:`, e);
  }
}
