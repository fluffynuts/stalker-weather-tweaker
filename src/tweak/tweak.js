require("../shared/async-arrays");
const
  parse = require("./parse"),
  process = require("./process"),
  io = require("../shared/io");
async function tweak(args) {
  const parsed = await parse(args);

  await parsed.files.forEachAsync(async (file) => {
    const
      lines = await io.readLines(file),
      processed = process(lines, parsed.rules);
    await io.writeLines(file, processed);
  });
}

module.exports = tweak;
