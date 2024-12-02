# 🎅🏽🦖 Advent of Code 2024, solved using Deno and TypeScript

A powerful and flexible setup for solving Advent of Code puzzles with Deno. This toolkit helps you scaffold, download, and solve puzzles with ease. 🧩

## 🚀 Features

- **Automatic Scaffolding**: Generate boilerplate code for new days. 🛠️
- **Puzzle Download**: Fetch inputs and puzzles directly from Advent of Code with the `aoc` CLI. 📦
- **Task Runner**: Manage development tasks using Deno's `task` feature. ✅
- **TypeScript Support**: Write clean, type-safe solutions. 📜

## 📦 Setup

1. Install [Deno](https://deno.land/).
2. Install the `aoc` CLI tool ([documentation](https://github.com/scarvalhojr/aoc-cli)).
3. Create a session cookie file at `~/.adventofcode.session` for fetching inputs.

## 🛠️ Tasks

This project uses `deno task` to simplify common workflows:

- `scaffold <day>`: Create boilerplate files for a given day.
- `download <day>`: Download input and puzzle files for a specific day.
- `solve <day>`: Run the solution for a specific day.

### Example Commands

```bash
# Scaffold a new day
deno task scaffold 1

# Download inputs for day 1
deno task download 1

# Solve puzzles for day 1
deno task solve 1

# Run tests on example data for day 1
deno task test 1
```

## 📂 Folder Structure

```bash
├── days/                  # Solutions for each day
│   ├── day01.ts           # Day 1 solution
│   ├── day02.ts           # Day 2 solution
│   └── ...
├── data/                  # Input and example data
│   ├── inputs/            # Puzzle inputs
│   ├── examples/          # Example inputs
│   └── puzzles/           # Puzzle descriptions
├── scripts/               # Helper scripts
│   ├── scaffold.ts        # Scaffolding script
│   ├── download.ts        # Download script
│   ├── solve.ts           # Solve script
│   └── _template.ts       # Template for scaffolding
└── deno.json              # Deno configuration
```

## 🌟 How It Works

- Use `scaffold` to create a solution template for a specific day.
- Use `download` to fetch inputs and puzzles.
- Write and test your solutions in the generated files.
- Use `solve` to run and verify your answers.
- Use `test` to run tests on example data for a specific day.

## 👋🏽 Developer Information

Made with ❤️ by [@magnusrodseth](https://github.com/magnusrodseth)
