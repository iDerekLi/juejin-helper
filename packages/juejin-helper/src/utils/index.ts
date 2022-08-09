import { v4 as uuid } from "uuid";
import { parseCookieTokens } from "./parse-cookietokens";

export async function wait(time: number = 0): Promise<undefined> {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function randomRangeNumber(start: number = 500, end: number = 1000): number {
  return (Math.random() * (end - start) + start) >> 0;
}

export function generateUUID(): string {
  return uuid();
}

export { parseCookieTokens };
