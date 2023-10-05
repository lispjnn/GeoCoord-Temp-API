import { fetchJSON } from "../include/fetchJSON.js";
import { GeoCoord } from "./fetchGeoCoord.js";

interface TemperatureReading {
  temperature_2m: number[];
  time: string[];
}
interface JSON {
  hourly: TemperatureReading;
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  const url = new URL("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m&temperature_unit=fahrenheit");
  url.searchParams.append("latitude", coords.lat.toString());
  url.searchParams.append("longitude", coords.lon.toString());

  const curTemp = fetchJSON<JSON>(url.toString()).then((json: JSON) =>
    Promise.resolve({ temperature_2m: json.hourly.temperature_2m, time: json.hourly.time })
  );
  const p = Promise<TemperatureReading>;
  return p.resolve(curTemp);
}
