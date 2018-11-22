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
  return {
    files: await findFilesIn(args),
    vars: findVarsIn(args)
  };
}

module.exports = parse;
