require("./matchers");
const sandbox = require("./sandbox");

afterAll(async () => {
  await sandbox.destroyAll();
});
