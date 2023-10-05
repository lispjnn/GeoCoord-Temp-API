import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fetchGeoResult } from "./fetchGeoCoord.js";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { average } from "./utility.js";

/*
 * Prompts the user for location queries that are searched for using the geocode API.
 * Ranks the *top* result (noted by its display_name) of each query by hottest
 * average temperature (rounded, in Fahrenheit, and sourced from meteo API).
 * Queries that return no results are listed at the bottom with N.R.
 *
 * Uses (1) location name/coordinate data and (2) location temperature data.
 */

function div(): void {
  console.log("~ ~ ~ ~ ~");
}

const rl = readline.createInterface({ input, output });
const queries: string[] = [];

/*
 * Prompt for and store queries. Example input:
 *  Query 1: Antartica
 *  Query 2: Miami
 *  Query 3: willnotreturnanyresults
 *  Query 4: New Mexico
 *  Query 5: DONE
 */
div();
console.log("Enter locations to search or 'DONE' if done.");
for (let i = 1; true; i++) {
  const query = await rl.question(`Query ${i}: `);
  if (query === "DONE") break;
  queries.push(query);
}
div();

console.log("Fetching queries...");
// Stores (display_name, average temperature) pairs.
const pairs = await Promise.all(
  queries.map(async query => {
    // Fetch top result, then fetch its TemperatureReading, then average.
    try {
      const coord = await fetchGeoResult(query);
      const reading = await fetchCurrentTemperature(coord);
      return { name: coord.display_name, temp: average(reading.temperature_2m) };
    } catch {
      // fetchGeo threw, so search query is N.R. Use temperature < absolute zero.
      return { name: query, temp: -9999 };
    }
  })
);

console.log("Sorting results...");
pairs.sort((a, b) => b.temp - a.temp);
console.log("Done!");

div();
console.log("RESULTS BY HOTTEST TEMPERATURE");
pairs.forEach((pair, i) =>
  console.log(++i + ") " + pair.name + ": ", pair.temp === -9999 ? "N.R." : Math.round(pair.temp * 100) / 100)
);
div();

rl.close();
