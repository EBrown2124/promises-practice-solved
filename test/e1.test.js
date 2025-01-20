import { vitest, it, describe, expect, beforeEach, afterEach } from "vitest";
import util from "util";
import {
  createOneSecondPromise,
  logMessageAfterOneSecond,
  logMessageAfterOneSecondAwait,
} from "../exercises/e1.js";

const isPending = (promise) => util.inspect(promise).includes("<pending>");

describe("createOneSecondPromise", () => {
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.clearAllTimers();
  });

  it("createOneSecondPromise should exist", () => {
    expect(createOneSecondPromise).toBeInstanceOf(Function);
  });

  it("createOneSecondPromise should return a Promise", () => {
    expect(createOneSecondPromise().constructor.name).toEqual("Promise");
  });

  it("Should resolve with the message 'The PROMISE was RESOLVED'", async () => {
    const result = createOneSecondPromise();
    vitest.runAllTimers();
    expect(await result).toBe("The PROMISE was RESOLVED");
  });

  it("Should resolve after 1 second", async () => {
    const result = createOneSecondPromise();
    expect(isPending(result)).toBe(true);
    vitest.advanceTimersByTime(1000);
    expect(isPending(result)).toBe(false);
  });
});

describe("logMessageAfterOneSecond", () => {
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.clearAllTimers();
  });

  it("should log the message we pass in", async () => {
    const logSpy = vitest.spyOn(console, "log");
    logMessageAfterOneSecond("my-message");
    await vitest.runAllTimersAsync();
    expect(logSpy).toHaveBeenLastCalledWith("my-message");
  });

  it("should only log after 1 second", async () => {
    vitest.useFakeTimers();
    const logSpy = vitest.spyOn(console, "log");
    logMessageAfterOneSecond("my-message");
    expect(logSpy).not.toHaveBeenLastCalledWith("my-message");
    await vitest.advanceTimersByTimeAsync(1000);
    expect(logSpy).toHaveBeenLastCalledWith("my-message");
  });
});

describe("logMessageAfterOneSecondAwait", () => {
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.clearAllTimers();
  });

  it("should log the message we pass in", async () => {
    const logSpy = vitest.spyOn(console, "log");
    logMessageAfterOneSecondAwait("my-message");
    await vitest.runAllTimersAsync();
    expect(logSpy).toHaveBeenLastCalledWith("my-message");
  });

  it("should only log after 1 second", async () => {
    vitest.useFakeTimers();
    const logSpy = vitest.spyOn(console, "log");
    logMessageAfterOneSecondAwait("my-message");
    expect(logSpy).not.toHaveBeenLastCalledWith("my-message");
    await vitest.advanceTimersByTimeAsync(1000);
    expect(logSpy).toHaveBeenLastCalledWith("my-message");
  });
});
