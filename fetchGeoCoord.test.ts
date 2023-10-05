import assert from "assert";
import { fetchGeoCoord } from "./fetchGeoCoord.js";

describe("fetchGeoCoord", () => {
  it("follows type specification", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");
    return promise.then(result => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
    });
  });

  it("returns an error for no results found", () => {
    const promise = fetchGeoCoord("University of Massachusetts at Amherst");
    return promise
      .then(() => assert(false))
      .catch((e: Error) => {
        assert(e.toString() === "Error: No results found for query.");
      });
  });
});
