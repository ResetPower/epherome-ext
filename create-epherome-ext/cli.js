#!/usr/bin/env node

const chalk = require("chalk");
const path = require("path");
const create = require("./create");

const args = process.argv.slice(2);
const name = args[0];

function adapt(src, ...args) {
  for (const i of args) {
    if (src === i) {
      return true;
    }
  }
  return false;
}

if (name) {
  const language = args[1] ?? "javascript";
  if (!adapt(language, "javascript", "typescript")) {
    console.log(
      `${chalk.red.bold("Error:")} ${chalk.red(
        `language is illegal.\n  should be ${chalk.yellow(
          "javascript"
        )} or ${chalk.blue("typescript")}`
      )}`
    );
  } else {
    create(name, path.join(process.cwd(), name), language);
  }
} else {
  console.log(
    `${chalk.red.bold("Error:")} ${chalk.red("project name required.")}`
  );
  console.log(
    `${chalk.whiteBright("Usage:")} <command> <project-name> <project-language>`
  );
  console.log(
    `  ${chalk.gray("project-language is optional, default javascript.")}`
  );
}
