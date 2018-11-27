const
  promisify = require("util.promisify"),
  fs = require("fs"),
  exists = promisify(fs.exists),
  stat = promisify(fs.stat);

async function isFile(arg) {
  const pathExists = await exists(arg);
  if (!pathExists) {
    return false;
  }
  const st = await stat(arg);
  return st.isFile();
}

module.exports = isFile;
