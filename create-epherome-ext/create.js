const { cyan, green } = require("chalk");
const path = require("path");
const {
  copySync,
  existsSync,
  readFileSync,
  writeFileSync,
} = require("fs-extra");

function cloneExtTemplate(language, target) {
  const template = path.join(__dirname, `./template-${language}`);
  if (existsSync(target)) {
    throw new Error(
      `Directory ${green(target)} already exists! Please change a project name!`
    );
  }
  if (!existsSync(template)) {
    throw new Error(
      `It seems something had wrong, templates are not installed successfully. You can try again.`
    );
  }
  copySync(template, target);
}

async function fillInTemplate(name, target) {
  const pkgPath = path.join(target, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath).toString());
  pkg.name = name;
  pkg.epherome.translations.default = name;
  const { default: latestVersion } = await import("latest-version");
  const ver = await latestVersion("epherome-ext");
  pkg.dependencies["epherome-ext"] = `^${ver}`;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

async function createExt(name, target, language) {
  console.log(`Creating a new Epherome extension in ${green.bold(target)}\n`);
  console.log(`Cloning ${cyan(language)} Template...`);
  cloneExtTemplate(language, target);
  await fillInTemplate(name, target);
  console.log("Done!\n");
  console.log("We suggest that you begin by typing:\n");
  console.log(`  ${green("cd")} ${name}`);
  console.log(`  ${green("npm")} install`);
  console.log(`  ${green("npm")} run build\n`);
  console.log(`Learn more at documents: ${green("https://epherome.com/docs")}`);
  console.log("Happy hacking!");
}

module.exports = createExt;
