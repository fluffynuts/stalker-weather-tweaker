require("expect-more-jest");

function assert(expr, failMessage) {
  if (!expr) {
    if (typeof failMessage === "function") {
      failMessage = failMessage();
    }
    throw new Error(failMessage);
  }
}

function runAssertions(ctx, func) {
  try {
    const message = func() || "";
    return {
      message: typeof message === "function" ? message : () => message,
      pass: true
    };
  } catch (e) {
    return {
      pass: false,
      message: () => e.message || e
    };
  }
}

// async function runAssertionsAsync(ctx, func) {
//   try {
//     await func();
//     return {
//       message: () => "",
//       pass: !ctx.isNot
//     };
//   } catch (e) {
//     return {
//       pass: false,
//       message: () => e.message || e
//     };
//   }
// }

function testIsInstance(actual, ctor) {
  assert(actual !== undefined, "actual is undefined");
  assert(actual !== null, "actual is null");
  assert(
    actual instanceof ctor,
    `Expected instance of ${Object.prototype.toString.call(
      ctor
    )} but got ${actual}`
  );
}

function notFor(self) {
  return self.isNot ? " not " : " ";
}

beforeAll(() => {
  expect.extend({
    toBeAsyncFunction(actual) {
      return runAssertions(this, () => {
        const msg = () =>
          `expected${notFor(this)}async function but got ${JSON.stringify(
            actual
          )}`;
        assert(
          Object.prototype.toString.call(actual) === "[object AsyncFunction]" ||
            Object.prototype.toString.call(actual) === "[object Function]",
          msg
        );
        return msg;
      });
    },
    toExist(actual) {
      return runAssertions(this, () => {
        assert(
          actual !== null && actual !== undefined,
          () => `Expected ${actual}${notFor(this)}to exist`
        );
        return `Expected ${actual}${notFor(this)}to exist`;
      });
    },
    toBeA(actual, ctor) {
      return runAssertions(this, () => {
        testIsInstance(actual, ctor);
        return () =>
          `expected${notFor(
            this
          )}to get instance of ${ctor}, but received ${actual}`;
      });
    },
    toBeAn(actual, ctor) {
      return runAssertions(this, () => {
        testIsInstance(actual, ctor);
        return () =>
          `expected${notFor(
            this
          )}to get instance of ${ctor}, but received ${actual}`;
      });
    }
  });
});
