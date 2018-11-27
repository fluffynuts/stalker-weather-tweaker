#!/usr/bin/env node
const utilName = "stalker-weather-tweaker";
async function showHelp() {
  const
    findVersion = require("./find-version"),
    version = await findVersion();
  [
    `S.T.A.L.K.E.R weather variable tweaker ${version}`,
    "  Usage:",
    `  ${utilName} [file] {..file} {options}`,
    "    where options are of the form:",
    "    -variable (+|-|=|~)value",
    "",
    "    variables may be:",
    "      increased: +",
    "      decreased: -",
    "      set      : =",
    "      unchanged: ~",
    "",
    "  example:",
    "",
    "    tweak file1.ltx file2.ltx -fog_color +0.01 -0.02 =0.04",
    "",
    "    would modify files file1.ltx and file2.ltx,",
    "      - modifying all found fog_color variables:",
    "      - adding 0.01 to the first parameter",
    "      - subtracting 0.02 from the second parameter",
    "      - setting the third parameter to 0.04",
    "  hints:",
    "    extra parameters or settings are ignored",
    "    use ~ to 'skip over' a parameter you don't want to change"
  ].forEach(line => console.log(line));
}

async function showVersion() {
  const
    findVersion = require("./find-version"),
    version = await findVersion();
  console.log(`${utilName}: ${version}`);
}
(async function () {
  const
    path = require("path"),
    tweak = require("../tweak/tweak");
  let inArgs = false;
  const args = process.argv.reduce(
    (acc, cur) => {
      if (inArgs) {
        acc.push(cur);
        return acc;
      }
      const parts = cur.split(path.sep);
      if (parts[parts.length - 1] === "tweak.js" || parts[parts.length - 1] === utilName) {
        inArgs = true;
      }
      return acc;
    }, []);

  if (args.length === 0 ||
    args.indexOf("-h") > -1 ||
    args.indexOf("--help") > -1) {
    return await showHelp();
  }

  if (args.indexOf("--version") > -1) {
    return await showVersion();
  }

  await tweak(args);
})();



