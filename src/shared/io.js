const
  promisify = require("util.promisify"),
  winEol = "\r\n",
  unixEol = "\n",
  os = require("os"),
  fs = require("fs"),
  readFile = promisify(fs.readFile),
  writeFile = promisify(fs.writeFile);

function eolFor(data) {
  return data.indexOf(winEol) > -1 ? winEol : unixEol;
}

async function readLines(file) {
  const
    contents = await readFile(file, { encoding: "utf-8" }),
    eol = eolFor(contents);
  return contents.split(eol);
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
