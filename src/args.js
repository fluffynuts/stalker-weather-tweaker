require("./async-arrays");
const
  promisify = require("util.promisify"),
  fs = require("fs"),
  exists = promisify(fs.exists),
  stat = promisify(fs.stat);

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
  const files = [];
  for (let arg of args) {
    if (await isFile(arg)) {
      files.push(arg);
    }
  }
  remove(files, args);
  return files;
}

async function isFile(arg) {
  const pathExists = await exists(arg);
  if (!pathExists) {
    return false;
  }
  const st = await stat(arg);
  return st.isFile();
}

function findVarsIn(args) {
  return args.reduce((acc, cur) => {
    if (cur.indexOf("-") === 0) {
      const trimmed = cur.replace(/^-/, "");
      let thisVar = acc.find(o => o.name === trimmed);
      if (!thisVar) {
        thisVar = {
          name: trimmed,
          values: []
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
      numerics = stringValues.map(s =>
        parseFloat(s.replace(/^\+/, ""), 10)
      );
    lastVar.values.push.apply(lastVar.values, numerics);
    return acc;
  }, []);
}

async function parse(args) {
  args = args || [];
  return {
    files: await findFilesIn(args),
    vars: findVarsIn(args)
  };
}

module.exports = parse;
