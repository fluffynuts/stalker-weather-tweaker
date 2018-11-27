require("../shared/async-arrays");
const
  glob = require("globby"),
  isFile = require("../shared/is-file");

function remove(needles, haystack) {
  needles.forEach(f => {
    for (;;) {
      const idx = haystack.indexOf(f);
      if (idx === -1) {
        return;
      }
      haystack.splice(idx, 1);
    }
  });
  return haystack;
}

async function findFilesIn(args) {
  const
    files = [],
    toRemove = [];
  for (let arg of args) {
    const f = await isFile(arg);
    if (f) {
      files.push(arg);
    } else {
      const matches = await glob(arg);
      if (matches.length > 0) {
        files.push.apply(files, matches);
        toRemove.push(arg);
      }
    }
  }
  remove(files, args);
  remove(toRemove, args);
  return files;
}

function findRulesIn(args) {
  let lastOp = "=";
  return args.reduce((acc, cur) => {
    if (cur.indexOf("-") === 0 && isNaN(parseFloat(cur))) {
      const trimmed = cur.replace(/^-/, "");
      let thisVar = acc.find(o => o.name === trimmed);
      if (!thisVar) {
        thisVar = {
          name: trimmed,
          modifiers: []
        };
        acc.push(thisVar);
      }
      return acc;
    }
    const lastVar = acc[acc.length - 1];
    if (!lastVar) {
      console.warn("no last var...");
      return acc;
    }
    const
      stringValues = cur.split(",").map(s => s.trim()).filter(s => s),
      modifiers = stringValues.map(s => {
        if (!s) {
          return;
        }
        if (s === "~") {
          return {
            op: "~"
          };
        }
        const
          value = parseFloat(s.replace(/^[+=-]/, "")),
          setOp = s[0] || "=",
          op = isNaN(parseInt(setOp, 10)) ? setOp : lastOp;
        lastOp = op;
        return {
          op,
          value
        };
      }).filter(o => o);
    lastVar.modifiers.push.apply(lastVar.modifiers, modifiers);
    return acc;
  }, []);
}

async function parse(args) {
  args = args || [];
  if (!Array.isArray(args)) {
    args = [ args ];
  }
  return {
    files: await findFilesIn(args),
    rules: findRulesIn(args)
  };
}

module.exports = parse;
