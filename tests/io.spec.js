require("./matchers");
const
  readLines = require("../src/shared/io").readLines,
  writeFile = require("../src/shared/io").writeLines,
  path = require("path"),
  Sandbox = require("./sandbox"),
  sandbox = new Sandbox(path.basename(__filename)),
  faker = require("faker");
describe(`io`, () => {
  it(`should export the readLines function`, () => {
    // Arrange
    // Act
    expect(readLines).toBeAsyncFunction();
    // Assert
  });
  describe(`behavior`, () => {
    it(`should read/write all lines from a file`, async () => {
      // Arrange
      const
        lines = [
          faker.random.alphaNumeric(4),
          faker.random.alphaNumeric(4),
          faker.random.alphaNumeric(4)],
        fileName = faker.random.alphaNumeric(4),
        box = await sandbox.create(),
        filePath = path.join(box, fileName);
      await writeFile(filePath, lines);
      // Act
      const result = await readLines(filePath);
      // Assert
      expect(result).toEqual(lines);
    });

    it(`should write string data too`, async () => {
      // Arrange
      const
        data = faker.random.alphaNumeric(20),
        fileName = faker.random.alphaNumeric(4),
        box = await sandbox.create(),
        filePath = path.join(box, fileName);
      // Act
      await writeFile(filePath, data);
      const result = await readLines(filePath);
      // Assert
      expect(result).toEqual([ data ]);
    });
  });

  afterEach(async () => {
    await sandbox.destroyAll();
  });
});
