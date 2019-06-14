require("expect-more-jest");
const
  path = require("path"),
  Sandbox = require("./sandbox"),
  sandbox = new Sandbox(path.basename(__filename)),
  io = require("../src/shared/io"),
  fs = require("fs"),
  promisify = require("util.promisify"),
  cp = promisify(fs.copyFile),
  tweak = require("../src/tweak/tweak");

describe(`tweak`, () => {
  it(`should export the tweak function`, () => {
    // Arrange
    // Act
    expect(tweak).toBeAsyncFunction();
    // Assert
  });

  it(`should tweak the provided file with the provided parameters`, async () => {
    // Arrange
    const
      box = await sandbox.create(),
      src = path.join(__dirname, "test-data", "1.ltx"),
      modFile = path.join(box, "test.ltx"),
      expectedSrc = path.join(__dirname, "test-data", "tweak-out.ltx"),
      expected = await io.readLines(expectedSrc),
      args = [
        modFile,
        "-wind_velocity", "+100", // simple addition
        "-fog_color", "=1.0", "~", "+0.5", // test leaving intermediate the same (~)
        "-sun_color", "~", "~", "~", "+20", // test "too many args": should change nothing
        "-rain_color", "-0.1", // test "not enough args": should only mod where possible
      ];
    await cp(src, modFile);

    // Act
    await tweak(args);
    // Assert
    const result = await io.readLines(modFile);
    expect(result).toEqual(expected);
  });

  it(`should tweak the provided files with the provided parameters`, async () => {
    // Arrange
    const
      box = await sandbox.create(),
      src = path.join(__dirname, "test-data", "1.ltx"),
      modFile1 = path.join(box, "test.ltx"),
      modFile2 = path.join(box, "test2.ltx"),
      expectedSrc = path.join(__dirname, "test-data", "tweak-out.ltx"),
      expected = await io.readLines(expectedSrc),
      args = [
        path.join(box, "*.ltx"),
        "-wind_velocity", "+100", // simple addition
        "-fog_color", "=1.0", "~", "+0.5", // test leaving intermediate the same (~)
        "-sun_color", "~", "~", "~", "+20", // test "too many args": should change nothing
        "-rain_color", "-0.1", // test "not enough args": should only mod where possible
      ];
    await cp(src, modFile1);
    await cp(src, modFile2);
    spyOn(console, "warn");

    // Act
    await tweak(args);
    // Assert
    const result1 = await io.readLines(modFile1);
    expect(result1).toEqual(expected);
    const result2 = await io.readLines(modFile2);
    expect(result2).toEqual(expected);
    expect(console.warn).not.toHaveBeenCalled();
  });

  afterEach(async () => {
    await sandbox.destroyAll();
  });
});
