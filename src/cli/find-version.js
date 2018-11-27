const
  promisify = require("util.promisify"),
  fs = require("fs"),
  readFile = promisify(fs.readFile),
  path = require("path"),
  isFile = require("../shared/is-file");

async function findPackageJson() {
  let
    last = null,
    current = __dirname;

  do {
    const
      check = path.join(current, "package.json"),
      exists = await isFile(check);
    if (exists) {
      return check;
    }
    last = current;
    current = path.dirname(current);
  } while (current !== last);

}

async function findVersion() {
  const
    packageFile = await findPackageJson(),
    contents = await readFile(packageFile, { encoding: "utf-8" }),
    blob = JSON.parse(contents);
  return blob.version;
}

module.exports = findVersion;
