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
      if (parts[parts.length - 1] === "tweak.js") {
        inArgs = true;
      }
      return acc;
    }, []);

  await tweak(args);
})();



