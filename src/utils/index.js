import { v4 as uuid } from "uuid";
import { parseCookieTokens } from "./parse-cookietokens";

export async function wait(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function randomRangeNumber(start = 500, end = 1000) {
  return (Math.random() * (end - start) + start) >> 0;
}

export function generateUUID() {
  return uuid();
}

export { parseCookieTokens };
