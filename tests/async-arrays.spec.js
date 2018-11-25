require("../src/shared/async-arrays");

describe(`async-arrays`, () => {
  it(`should provide forEachAsync`, async () => {
    // Arrange
    const collector = [],
      src = [ 1, 2, 3, 4 ];
    // Act
    await src.forEachAsync(async (el) => {
      const result = await new Promise((resolve) => {
        resolve(el);
      });
      collector.push(result);
    });
    // Assert
    expect(collector).toEqual(src);
  });
});
