const uuid = require("uuid/v4"),
  promisify = require("util.promisify"),
  path = require("path"),
  mkdir = promisify(require("mkdirp")),
  rimraf = promisify(require("rimraf")),
  prefix = "__sandboxes__";

async function destroyAll() {
  await rimraf(path.join(__dirname, prefix));
}

async function destroy(dir) {
  await rimraf(dir);
}

async function create() {
  const result = path.join(__dirname, prefix, uuid());
  await mkdir(result);
  return result;
}

module.exports = {
  create,
  destroy,
  destroyAll
};
