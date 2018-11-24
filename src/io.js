const
  promisify = require("util.promisify"),
  os = require("os"),
  fs = require("fs"),
  readFile = promisify(fs.readFile),
  writeFile = promisify(fs.writeFile);

async function readLines(file) {
  const contents = await readFile(file, { encoding: "utf-8" });
  return contents.split("\n").map(line => line.trim());
}

async function writeLines(file, data) {
  const
    contents = Array.isArray(data) ? data.join(os.EOL) : data;
  return await writeFile(file, contents, { encoding: "utf-8" });
}

module.exports = {
  readLines,
  writeLines
};
