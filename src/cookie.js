class Cookie {
  constructor(cookie) {
    this.cookie = "";
    this.stack = new Map();
    if (cookie) {
      this.setCookieValue(cookie);
    }
  }

  setCookieValue(cookie = "") {
    this.stack.clear();
    this.cookie = cookie;
    cookie.split("; ").map(string => string.split("=")).forEach(([key, value]) => {
      this.stack.set(key, value);
    });
  }

  get(key) {
    return this.stack.get(key);
  }

  has(key) {
    return this.stack.has(key);
  }

  set(key, value) {
    return this.stack.set(key, value);
  }

  entries() {
    return this.stack.entries();
  }

  clear() {
    this.cookie = "";
    this.stack.clear();
  }

  toString() {
    return this.cookie;
  }
}

export default Cookie;
