class Cookie {
  cookie: string = "";
  stack: Map<string, unknown> = new Map();

  constructor(cookie: string = "") {
    if (cookie) {
      this.setCookieValue(cookie);
    }
  }

  setCookieValue(cookie: string = "") {
    this.stack.clear();
    this.cookie = cookie;
    cookie
      .split("; ")
      .map(string => string.split("="))
      .forEach(([key, value]) => {
        this.stack.set(key, value);
      });
  }

  get(key: string) {
    return this.stack.get(key);
  }

  has(key: string) {
    return this.stack.has(key);
  }

  set(key: string, value: unknown) {
    return this.stack.set(key, value);
  }

  entries() {
    return this.stack.entries();
  }

  clear(): void {
    this.cookie = "";
    this.stack.clear();
  }

  toString(): string {
    return this.cookie;
  }
}

export default Cookie;
