import { it, describe, expect, beforeEach, afterEach } from "vitest";
import { returnPromise, returnRejectingPromise } from "../exercises/e8.js";

describe("returnPromise", () => {
  it("returnPromise variable should exist", () => {
    expect(returnPromise).toBeInstanceOf(Function);
  });

  it("returnPromise should return a Promise", () => {
    expect(returnPromise().constructor.name).toEqual("Promise");
  });

  it("returnPromise should resolve to 'The PROMISE was RESOLVED'", async () => {
    expect(await returnPromise()).toBe("The PROMISE was RESOLVED");
  });

  it("The string representing the code that you wrote for returnPromise should have less than `80` characters", () => {
    const characterCount = returnPromise.toString().length;
    expect(characterCount).toBeLessThan(80);
  });
});

describe("returnRejectingPromise", () => {
  let promise;

  beforeEach(() => {
    promise = returnRejectingPromise();
  });
  afterEach(async () => {
    await promise.catch(() => {});
  });

  it("returnRejectingPromise function should exist", async () => {
    expect(returnRejectingPromise).toBeInstanceOf(Function);
  });

  it("returnRejectingPromise should return a Promise", () => {
    expect(promise.constructor.name).toEqual("Promise");
  });

  it("returnRejectingPromise should reject with a message of 'The PROMISE was REJECTED'", async () => {
    expect(await promise.catch((n) => n)).toEqual("The PROMISE was REJECTED");
  });

  it("The string representing the code that you wrote for returnRejectingPromise should have less than `80` characters", () => {
    const characterCount = returnRejectingPromise.toString().length;
    expect(characterCount).toBeLessThan(80);
  });
});
