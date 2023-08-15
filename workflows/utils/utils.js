module.exports = {
  async wait(time = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
  },
  randomRangeNumber(start = 500, end = 1000) {
    return (Math.random() * (end - start) + start) >> 0;
  },
  getUsersCookie(env) {
    const users = [env.COOKIE];

    const keys = Object.keys(env).filter(key => key.match(/^COOKIE_([0-9])+$/));
    keys.forEach(key => users.push(env[key]));

    return users.filter(cookie => !!cookie);
  }
};
