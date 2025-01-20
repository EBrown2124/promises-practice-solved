import { afterAll, beforeAll, describe, expect, it, vitest } from "vitest";
import {
  getFirstPromiseOrFail,
  getFirstResolvedPromise,
  getQuantityOfRejectedPromises,
  getQuantityOfFulfilledPromises,
  fetchAllCharactersByIds,
  allCharacters,
} from "../exercises/e10";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const failAfterWith = (ms, withValue) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(withValue);
    }, ms)
  );

describe("e10", () => {
  beforeAll(() => {
    vitest.useFakeTimers();
  });

  describe("getFirstResolvedPromise", () => {
    it("should return the first promise that resolves", async () => {
      const oneSecondPromise = wait(1000).then(() => "1");
      const twoSecondPromise = wait(1000).then(() => "2");
      const result = getFirstResolvedPromise([
        oneSecondPromise,
        twoSecondPromise,
      ]);
      vitest.runOnlyPendingTimers();

      expect(await result).toBe("1");
    });

    it("should return the first promise that resolves", async () => {
      const oneSecondPromise = wait(1000).then(() => "1");
      const twoSecondPromise = wait(2000).then(() => "2");
      const result = getFirstResolvedPromise([
        twoSecondPromise,
        oneSecondPromise,
      ]);

      vitest.runOnlyPendingTimers();

      expect(await result).toBe("1");
    });

    it("should not fail if one thing rejects", async () => {
      const oneSecondPromise = wait(1000).then(() => "3");
      const twoSecondPromise = wait(2000).then(() => "4");
      const halfSecondFailure = failAfterWith(500);

      const result = getFirstResolvedPromise([
        halfSecondFailure,
        twoSecondPromise,
        oneSecondPromise,
      ]);

      vitest.runOnlyPendingTimers();
      expect(await result).toBe("3");
    });
  });

  describe("getFirstPromiseOrFail", () => {
    it("should return the first promise that resolves if all promises resolve", async () => {
      const oneSecondPromise = wait(1000).then(() => "1");
      const twoSecondPromise = wait(1000).then(() => "2");

      const result = getFirstPromiseOrFail([
        twoSecondPromise,
        oneSecondPromise,
      ]);

      vitest.runOnlyPendingTimers();
      expect(await result).toBe("1");
    });

    it("should not fail when encountering a failure after resolving", async () => {
      const oneSecondPromise = wait(1000).then(() => "1");
      const threeSecondFailure = failAfterWith(3000, "3");
      const result = getFirstPromiseOrFail([
        threeSecondFailure,
        oneSecondPromise,
      ]).catch(() => "failed");

      vitest.advanceTimersToNextTimer();

      expect(await result).toBe("1");
    });

    it("should reject when encountering a failure before resolving", async () => {
      const oneSecondPromise = wait(1000).then(() => "1");
      const twoSecondPromise = wait(1000).then(() => "2");
      const halfSecondFailure = failAfterWith(500, "3");

      const result = getFirstPromiseOrFail([
        twoSecondPromise,
        halfSecondFailure,
        oneSecondPromise,
      ])
        .then(() => "resolved")
        .catch((error) => error);

      vitest.advanceTimersToNextTimer();

      expect(await result).toBe("3");
    });
  });

  describe("getQuantityOfRejectedPromises", () => {
    it("should get 3 failures if I pass in 3 failing promises and 1 succeeding promise", async () => {
      const promises = [
        failAfterWith(1, "rejected"),
        failAfterWith(1, "rejected"),
        wait(1000),
        failAfterWith(100, "rejected"),
      ];

      const result = getQuantityOfRejectedPromises(promises);
      vitest.runAllTimers();

      expect(await result).toBe(3);
    });

    it("should get 0 failures if I pass in all successful promises", async () => {
      const promises = [wait(1000), wait(2000), wait(4000)];

      const result = getQuantityOfRejectedPromises(promises);
      vitest.runAllTimers();

      expect(await result).toBe(0);
    });

    it("should get 2 failures if I pass in 2 failures and 2 successes", async () => {
      const promises = [
        wait(1000),
        failAfterWith(500, "rejected"),
        wait(2000),
        failAfterWith(500, "rejected"),
      ];

      const result = getQuantityOfRejectedPromises(promises);
      vitest.runAllTimers();

      expect(await result).toBe(2);
    });
  });

  describe("getQuantityOfFulfilledPromises", () => {
    it("should get me 1 resolved if I pass in three failing promises and 1 succeeding promise", async () => {
      const promises = [
        failAfterWith(1, "rejected"),
        failAfterWith(1, "rejected"),
        wait(1000),
        failAfterWith(100, "rejected"),
      ];

      const result = getQuantityOfFulfilledPromises(promises);
      vitest.runAllTimers();

      expect(await result).toBe(1);
    });

    it("should get 3 resolved values if I pass in 3 successful promises", async () => {
      const promises = [wait(1000), wait(2000), wait(4000)];

      const result = getQuantityOfFulfilledPromises(promises);
      vitest.runAllTimers();

      expect(await result).toBe(3);
    });
  });

  describe.concurrent("fetchAllCharactersByIds", () => {
    beforeAll(() => {
      vitest.useRealTimers();
    });
    afterAll(() => {
      vitest.useFakeTimers();
    });

    it("[1,2], should return billy and mandy", async () => {
      const result = fetchAllCharactersByIds([1, 2]);

      expect(await result).toEqual([
        allCharacters.find((c) => c.id === 1),
        allCharacters.find((c) => c.id === 2),
      ]);
    });

    it("[1,2,3] should return all characters", async () => {
      const result = fetchAllCharactersByIds([1, 2, 3]);
      expect(await result).toEqual(allCharacters);
    });

    it(
      "should not take more than one second to run on all characters ",
      async () => {
        const result = fetchAllCharactersByIds([1, 2, 3]);
        expect(await result).toEqual(allCharacters);
      },
      { timeout: 1050 }
    );

    it("should return an empty array if any id is bad", async () => {
      const result = fetchAllCharactersByIds([1, 2, 3, 4]);
      expect(await result).toEqual([]);
    });
  });
});
