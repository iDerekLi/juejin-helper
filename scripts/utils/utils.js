module.exports = {
  async wait(time = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
  },
  randomRangeNumber(start = 500, end = 1000) {
    return (Math.random() * (end - start) + start) >> 0;
  }
}
