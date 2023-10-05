import { fetchJSON } from "../include/fetchJSON.js";

export interface GeoCoord {
  lat: number;
  lon: number;
}

interface GeoResult extends GeoCoord {
  display_name: string;
}

/*
 * Returns the display_name, lat, and lon (GeoResult) from given query.
 * Throws if query result is empty.
 * Resued in main.ts.
 */
export async function fetchGeoResult(query: string): Promise<GeoResult> {
  const url = new URL("https://geocode.maps.co/search");
  url.searchParams.append("q", query);

  const json: GeoResult[] = await fetchJSON(url.toString());
  if (json.length === 0) throw new Error("No results found for query.");
  return { display_name: json[0].display_name, lat: Number(json[0].lat), lon: Number(json[0].lon) };
}

export async function fetchGeoCoord(query: string): Promise<GeoCoord> {
  const result = await fetchGeoResult(query);
  return { lat: result.lat, lon: result.lon };
}
