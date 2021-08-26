#!/usr/bin/env node

const pkg = require("./package.json");
const webpack = require("webpack");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

function removePrefix(src, pre) {
  return src.startsWith(pre) ? src.substring(pre.length) : src;
}

if (args[0] === "build") {
  const cwd = process.cwd();
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(cwd, "package.json")).toString()
    );
    webpack(
      {
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: /node_modules/,
              use: "ts-loader",
            },
          ],
        },
        resolve: {
          extensions: [".js", ".ts"],
        },
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          const outputStats = args[1] === "--output-stats";
          console.log(
            `${chalk.bold("Sorry 😨!")} Error occurred when building!`
          );
          if (!outputStats) {
            console.log(
              `For more details, run ${chalk.green(
                "npm run build -- --output-stats"
              )} or ${chalk.green("eph-ext build --output-stats")}\n`
            );
          } else {
            console.log("\n");
            console.log(stats.toJson());
          }
          throw err;
        } else {
          const extMeta = path.join(cwd, "dist", "ext.json");
          fs.writeFileSync(
            extMeta,
            JSON.stringify({
              name: pkg.name,
              version: pkg.version,
              apiVersion: removePrefix(pkg.dependencies["epherome-ext"], "^"),
              ...pkg.epherome,
            })
          );
          console.log(`${chalk.bold("Congrats 🎉!")} Built successfully.`);
        }
      }
    );
  } catch {
    throw new Error(`${chalk.bold("OMG 😱")} package.json not exist!`);
  }
} else {
  console.log(`epherome-ext version ${pkg.version}`);
  console.log(`  help - ${chalk.whiteBright("See commands of epherome-ext.")}`);
  console.log(`  build - ${chalk.whiteBright("Build Epherome extension.")}`);
  console.log(`For documents see ${chalk.green("https://epherome.com/docs")}`);
}
