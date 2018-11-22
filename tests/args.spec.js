const parse = require("../src/args"),
  sandbox = require("./sandbox"),
  promisify = require("util.promisify"),
  path = require("path"),
  fs = require("fs"),
  cp = promisify(fs.copyFile);
require("expect-more-jest");

describe("args", () => {
  it("should export the parse function", () => {
    // Arrange
    // Act
    expect(parse).toBeAsyncFunction();
    // Assert
  });
  describe("behavior", () => {
    it("should collect all file paths", async () => {
      // Arrange
      const box = await sandbox.create(),
        srcFile = testFile("1.ltx"),
        target1 = path.join(box, "1.ltx"),
        target2 = path.join(box, "2.ltx");
      await cp(srcFile, target1);
      await cp(srcFile, target2);
      const args = [target1, target2];
      // Act
      const result = await parse(args);
      // Assert
      expect(result).toExist();
      expect(result.files).toBeArray();
      expect(result.files).toHaveLength(2);
    });

    describe(`vars`, () => {
      it(`should collect all modifiers, default to =`, async () => {
        jest.setTimeout(30000);
        // Arrange
        const
          args = ["-moo", "0.1", "0.2,", "0.3,0.4"],
          expected = {
            name: "moo",
            modifiers: [
              { op: "=", value: 0.1 },
              { op: "=", value: 0.2 },
              { op: "=", value: 0.3 },
              { op: "=", value: 0.4 }]
          };
        // Act
        const result = await parse(args);
        // Assert
        expect(result).toExist();
        expect(result.vars).toExist();
        expect(result.vars).toHaveLength(1);
        expect(result.vars[0]).toEqual(expected);
      });

      it(`should collect all modifiers, using specified ops`, async () => {
        // Arrange
        const
          args = ["-moo", "-0.1", "+0.2,", "+0.3,+0.4"],
          expected = {
            name: "moo",
            modifiers: [
              { op: "-", value: 0.1 },
              { op: "+", value: 0.2 },
              { op: "+", value: 0.3 },
              { op: "+", value: 0.4 }]
          };
        // Act
        const result = await parse(args);
        // Assert
        expect(result).toExist();
        expect(result.vars).toExist();
        expect(result.vars).toHaveLength(1);
        expect(result.vars[0]).toEqual(expected);
      });

      it(`should default modifier operations to the last seen if not present`, async() => {
        // Arrange
        const
          args = ["-moo", "-0.1", "+0.2,", "+0.3,0.4"],
          expected = {
            name: "moo",
            modifiers: [
              { op: "-", value: 0.1 },
              { op: "+", value: 0.2 },
              { op: "+", value: 0.3 },
              { op: "+", value: 0.4 }]
          };
        // Act
        const result = await parse(args);
        // Assert
        expect(result).toExist();
        expect(result.vars).toExist();
        expect(result.vars).toHaveLength(1);
        expect(result.vars[0]).toEqual(expected);
      });

      it(`should default modifier operations to the last seen if not present (2)`, async() => {
        // Arrange
        const
          args = ["-moo", "-0.1", "0.2,", "0.3,0.4"],
          expected = {
            name: "moo",
            modifiers: [
              { op: "-", value: 0.1 },
              { op: "-", value: 0.2 },
              { op: "-", value: 0.3 },
              { op: "-", value: 0.4 }]
          };
        // Act
        const result = await parse(args);
        // Assert
        expect(result).toExist();
        expect(result.vars).toExist();
        expect(result.vars).toHaveLength(1);
        expect(result.vars[0]).toEqual(expected);
      });

    });
  });

  function testFile(file) {
    return path.join(__dirname, "test-data", file);
  }

  afterEach(async () => {
    sandbox.destroyAll();
  });
});
