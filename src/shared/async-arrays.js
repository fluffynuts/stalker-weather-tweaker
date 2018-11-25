Array.prototype.forEachAsync = async function(fn) {
  for (let i = 0; i < this.length; i++) {
    await fn(this[i], i);
  }
};

Array.prototype.reduceAsync = async function(fn, seed) {
  let start = seed !== undefined ? 1 : 0;
  let acc = seed || this[0];
  for (let i = start; i < this.length; i++) {
    acc = await fn(acc, this[i], i, this);
  }
  return acc;
};

Array.prototype.filterAsync = async function(fn, self) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    const cur = this[i];
    if (fn.call(self, cur, i, this)) {
      result.push(cur);
    }
  }
  return result;
};
