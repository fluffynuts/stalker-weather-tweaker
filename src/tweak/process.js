function process(
  lines,
  args
) {
  return lines.reduce(
    (acc, cur) => {
      const
        updated = findMatch(args, cur);

      acc.push(updated);
      return acc;
    }, []);
}

function findMatch(rules, line) {
  const
    parts = line.split(" "),
    match = rules.find(rule => parts.map(p => p.trim()).indexOf(rule.name) > -1);
  if (!match) {
    return line;
  }
  let idx = 0;
  return parts.reduce((acc, cur) => {

    if (!cur || cur === "=" || cur.trim() === match.name) {
      acc.push(cur);
      return acc;
    }
    const
      addComma = cur.indexOf(",") === cur.length - 1,
      val = parseFloat(cur),
      modifier = match.modifiers[idx++];
    if (!modifier || isNaN(val)) {
      acc.push(cur);
      return acc;
    }
    const places = grokPlaces(cur);
    let result = val;
    switch (modifier.op) {
      case "~":
        break;
      case "+":
        result += modifier.value;
        break;
      case "-":
        result -= modifier.value;
        break;
      case "=":
        result = modifier.value;
        break;
      default:
        throw new Error(`Unknown operation: "${modifier.op}"`);
    }
    let toPush = result.toFixed(places);
    if (addComma) {
      toPush += ",";
    }
    acc.push(toPush);
    return acc;
  }, []).join(" ");
}

function grokPlaces(str) {
  const parts = str.split(".").map(s => s.replace(/[,|\D]/, ""));
  if (parts.length === 1) {
    return 0;
  }
  return parts[1].length;
}

module.exports = process;
