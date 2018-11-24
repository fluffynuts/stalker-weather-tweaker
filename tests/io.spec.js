require("./matchers");
const
  readLines = require("../src/io").readLines,
  writeFile = require("../src/io").writeLines,
  path = require("path"),
  sandbox = require("./sandbox"),
  faker = require("faker");
describe(`read-lines`, () => {
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
});
