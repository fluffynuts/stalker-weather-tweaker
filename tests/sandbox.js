const uuid = require("uuid/v4"),
  promisify = require("util.promisify"),
  path = require("path"),
  mkdir = promisify(require("mkdirp")),
  rimraf = promisify(require("rimraf")),
  basePrefix = "__sandboxes__";

class Sandbox {
  constructor(localPrefix) {
    this._localPrefix = localPrefix.replace(/\./g, "_");
  }
  async destroyAll() {
    await rimraf(path.join(__dirname, basePrefix, this._localPrefix));
  }

  async destroy(dir) {
    await rimraf(dir);
  }

  async create() {
    const result = path.join(__dirname, basePrefix, this._localPrefix, uuid());
    await mkdir(result);
    return result;
  }

}

module.exports = Sandbox;
